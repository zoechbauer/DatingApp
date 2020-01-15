import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;   // program works correctly without this variable, why used ??

  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>,
              private authService: AuthService) { }

  ngOnInit() {
    const userRoles = this.authService.decodedToken.role as Array<string>;
    // if no rules clear the viewContainerRef
    if (!userRoles) {
      this.viewContainerRef.clear();
    }

    // if token contains rules then render the element
    if (this.authService.roleMatch(this.appHasRole)) {
      this.isVisible = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.isVisible = false;
      this.viewContainerRef.clear();
    }
  }
}
