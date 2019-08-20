import { Injectable } from '@angular/core';
import { mergeApiUri } from '../../global.vars';
import { Result } from '../../_models/index.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MergeService {

    constructor(private http: HttpClient){}

    merge(versionsIds: any){
        return this.http.post<Result>(mergeApiUri, versionsIds);
    }

}