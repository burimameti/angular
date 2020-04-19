import * as IronWeb from '@ironcorelabs/ironweb';
import { Injectable } from '@angular/core';
import { IronService } from '../iron/iron.service';
import * as Users from '../user/user.service';
import { IronPolicyFactory } from '../iron/iron-policy-factory';
import { Utils } from '../../utils';
import { UserIdentityProviderService } from '../user/user-identity-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  memeberGroup :IronWeb.GroupDetailResponse;

  constructor( 
    private ironPolicyFactory: IronPolicyFactory, 
    private ironService : IronService,
    private userService : Users.UserService, 
    private userIdentityService : UserIdentityProviderService) {
   
      ironService.ironIdentityProvider =  this.userIdentityService;

   }

   private getMemeberGrouptDetails(){
     const groupName = `top-secret-${Utils.randomInit()}`;
     return this.ironService.createGroup({groupName}).then((group)=>{return  group;})
   }
   init(){
     this.userService.setActiveByID(Users.KIRK);
     return this.getMemeberGrouptDetails().then((group) =>{
       console.log('team group created', group);
       this.ironPolicyFactory.bindings.set('top-secret', group.groupID);
     });
   }


}
