import { Injectable } from '@angular/core';
import { BusinessUserRequest } from '../../models/Auth/businessUserRequest';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  businessUserRequest: BusinessUserRequest = new BusinessUserRequest();
  
  constructor() { }


}
