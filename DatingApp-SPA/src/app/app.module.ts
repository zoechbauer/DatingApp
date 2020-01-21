import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule} from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { TimeAgoPipe } from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_Services/Auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_Services/error.interceptor';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { UserService } from './_Services/User.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit-resolver';
import { AuthGuard } from './_guards/auth.guard';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { ListResolver } from './_resolvers/list.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { AdminService } from './_Services/admin.service';
import { RolesModuleComponent } from './admin/roles-module/roles-module.component';
import { MobileService } from './_Services/mobile.service';


export function tokenGetter() {
   return localStorage.getItem('token');
}
export class CustomHammerConfig extends HammerGestureConfig  {
   overrides = {
       pinch: { enable: false },
       rotate: { enable: false }
   };
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      MemberMessagesComponent,
      PhotoEditorComponent,
      TimeAgoPipe,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagementComponent,
      PhotoManagementComponent,
      RolesModuleComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      ButtonsModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,
      FileUploadModule,
      ModalModule.forRoot(),
      JwtModule.forRoot({
         config: {
            // tslint:disable-next-line: object-literal-shorthand
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      UserService,
      AuthGuard,
      PreventUnsavedChanges,
      ListResolver,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
      MessagesResolver,
      AdminService,
      MobileService
   ],
   entryComponents: [
      RolesModuleComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
