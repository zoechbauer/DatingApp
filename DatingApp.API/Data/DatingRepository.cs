using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id, bool isCurrentUser)
        {
            // in version before photo management Include(Photos) was not necessary because of lazy loading
            //   e.g. var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            //        return user

            // version for .NET Core 3.1
            IQueryable<User> query;

            if (isCurrentUser) {
                query = _context.Users.Include(p => p.Photos).IgnoreQueryFilters().AsQueryable();
            } else {
                // note: if you don't use IgnoreQueryFilters you can omit the Include clause
                //       but you must use .Include() if you apply IgnoreQueryFilters as seen above
                // query = _context.Users.Include(p => p.Photos).AsQueryable();
                query = _context.Users.AsQueryable();
            }

            var user = await query.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.OrderByDescending(u => u.LastActive)
                .AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers) {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if (userParams.Likees) {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 19 || userParams.MaxAge != 99) {
                var minDateOfBirth = DateTime.Now.AddYears(-userParams.MaxAge - 1);
                var maxDateOfBirth = DateTime.Now.AddYears(-userParams.MinAge);
                users = users.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy)) {
                switch (userParams.OrderBy) {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers) {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (likers) {
                return user.Likers
                    .Where(u => u.LikeeId == id)
                    .Select(i => i.LikerId);
            } else {
                return user.Likees
                    .Where(u => u.LikerId == id)
                    .Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<Photo> GetPhoto(int id) {
            var photo = await _context.Photos
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public override bool Equals(object obj)
        {
            return base.Equals(obj);
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public override string ToString()
        {
            return base.ToString();
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsMain == true);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var message = _context.Messages
                .AsQueryable();

            switch(messageParams.MessageContainer) {
                case "Inbox":
                    message = message.Where(m => m.RecipientId == messageParams.UserId 
                        && m.RecipientDeleted == false);
                    break;
                case "Outbox":
                    message = message.Where(m => m.SenderId == messageParams.UserId
                        && m.SenderDeleted == false);
                    break;
                default:
                    message = message.Where(m => m.RecipientId == messageParams.UserId && m.IsRead == false
                        && m.RecipientDeleted == false);
                    break;
            }
            message.OrderByDescending(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int receipientId)
        {
            var messages = await _context.Messages
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false 
                            && m.SenderId == receipientId 
                            || m.RecipientId == receipientId && m.SenderDeleted == false
                            && m.SenderId == userId)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

            return messages;
        }
    }
}