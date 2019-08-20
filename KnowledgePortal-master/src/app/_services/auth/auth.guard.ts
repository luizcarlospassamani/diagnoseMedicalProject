import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from './auth.service'

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(private authService: AuthService, private router: Router){}

    canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let user = JSON.parse(this.authService.getCurrentUser());
        if(!user) {
            this.router.navigate(['pages/login'], { queryParams: {returnUrl: state.url} });
        }

        return true;
    }
}