import { Injectable, EventEmitter, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthService, AuthStatus } from '@pluritech/auth-service';

interface Request {
  headers: Headers;
  url: string;
};

@Injectable()
export class ServerService {

  private _timeout: number;

  private errorAF;
  private resMap;
  private reqUnauthorizedMsgShow: boolean;
  public onUnauthorized: EventEmitter<any> = new EventEmitter<any>();
  public onInvalidToken: EventEmitter<any> = new EventEmitter<any>();
  public onTimeout: EventEmitter<any> = new EventEmitter<any>();
  public onServerError: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: Http,
    private authService: AuthService,
    @Inject('timeoutToAll') private timeoutToAll) {
    if (this.timeoutToAll) {
      this._timeout = timeoutToAll || 8000;
    }
    this.errorAF = (error) => {

      if (error.name && error.name === 'TimeoutError') {
        this.onTimeout.emit(error.name);
        return Observable.throw({message: error.name});
      }
      let resJson = JSON.parse(error._body);
      if (resJson && resJson.status && resJson.status === 'Unauthorized') {
        if (resJson.message.includes('Invalid token')) {
          this.onInvalidToken.emit(resJson);
        }
        if  (!this.reqUnauthorizedMsgShow) {
          this.reqUnauthorizedMsgShow = true;
          this.onUnauthorized.emit(resJson);
        }
      }
      return Observable.throw(JSON.parse(error._body) || {message: 'Server Error'});
    };
    this.resMap = (res: Response) => res.status === 204 ? '' : res.json();
  }

  public getTimeout(): number {
    return this._timeout;
  }

  private buildParams(params: any): string {
    if (!params) {
      return '';
    }
    let qString = '';
    let count = 0;
    for (let i in params) {
      if (params[i]) {
        if (count === 0) {
          qString += '?' + i + '=' + params[i];
        } else {
          qString += '&' + i + '=' + params[i];
        }
        count = count + 1;
      }
    }
    return qString;
  }

  private prepareRequest(url: string, params?: any, headers?: Headers): Promise<Request> {
    return this.authService.isLogged().then((res) => {
      headers = headers || new Headers();
      if (res === AuthStatus.AUTHENTICATED) {
        const token = this.authService.getToken();
        headers.append('Authorization', token.accessToken);
      }
      const request: Request = {
        headers: headers,
        url: url + this.buildParams(params)
      };
      return request;
    }).catch(() => {
      const request: Request = {
        headers: new Headers(),
        url: url + this.buildParams(params)
      };
      return request;
    });
  }

/**
 * Performs a request with patch http method.
 * @param url requested url
 * @param params Optional url parameters
 * @param headers Optional headers parameters
 */
  public get(url: string, params?: any, timeout?: number, headers?: Headers): Promise<any> {
    return this.prepareRequest(url, params, headers).then((request) => {
      return this.http.get(request.url, {
        headers: request.headers
      }).map(this.resMap).timeout(timeout ? timeout : this._timeout).catch(this.errorAF).toPromise();
    });
  }

/**
 * Performs a request with patch http method.
 * @param url requested url
 * @param body the object to be sent
 * @param params Optional url parameters
 * @param headers Optional headers parameters
 */
  public put(url: string, body: any, timeout?: number, params?: any, headers?: Headers): Promise<any> {
    return this.prepareRequest(url, params, headers).then((request) => {
      return this.http.put(request.url, body, {
        headers: request.headers
      }).map(this.resMap).timeout(timeout ? timeout : this._timeout).catch(this.errorAF).toPromise();
    });
  }

/**
 * Performs a request with post http method.
 * @param url requested url
 * @param body the object to be sent
 * @param params Optional url parameters
 * @param headers Optional headers parameters
 */
  public post(url: string, body: any, timeout?: number, params?: any, headers?: Headers): Promise<any> {
    return this.prepareRequest(url, params, headers).then((request) => {
      return this.http.post(request.url, body, {
        headers: request.headers
      }).map(this.resMap).timeout(timeout ? timeout : this._timeout).catch(this.errorAF).toPromise();
    });
  }

/**
 * Performs a request with delete http method.
 * @param url requested url
 * @param params Optional url parameters
 * @param headers Optional headers parameters
 */
  public delete(url: string, timeout?: number, params?: any, headers?: Headers): Promise<any> {
    return this.prepareRequest(url, params, headers).then((request) => {
      return this.http.delete(request.url, {
        headers: request.headers
      }).map(this.resMap).timeout(timeout ? timeout : this._timeout).catch(this.errorAF).toPromise();
    });
  }

/**
 * Performs a request with patch http method.
 * @param url requested url
 * @param body the object to be sent
 * @param params Optional url parameters
 * @param headers Optional headers parameters
 */
  public patch(url: string, body: any, timeout?: number, params?: any, headers?: Headers): Promise<any> {
    return this.prepareRequest(url, params, headers).then((request) => {
      return this.http.patch(request.url, body, {
        headers: request.headers
      }).map(this.resMap).timeout(timeout ? timeout : this._timeout).catch(this.errorAF).toPromise();
    });
  }
}
