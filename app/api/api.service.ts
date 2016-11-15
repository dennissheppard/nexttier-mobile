import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { StorageService } from './storage.service';
import { UrlService } from './url.service';

@Injectable()
export class ApiService {

    private headers: Headers;
    private requestOptions: RequestOptions;
    private pathRoot: string;

    constructor(private http: Http,
                private urlService: UrlService,
                private storageService: StorageService) {
        this.setupHeaders();
    }

    setupHeaders() {
        this.headers = this.getHeaders();
        this.requestOptions = new RequestOptions({headers: this.headers});
        this.pathRoot = this.urlService.getPathRoot();
    }

    logMetrics(method: string, http: Http, start: number): any {
        function getLocation(href) {
            let match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
            return match && {
                    protocol: match[1],
                    host: match[2],
                    hostname: match[3],
                    port: match[4],
                    pathname: match[5],
                    search: match[6],
                    hash: match[7],
                };
        }

        let logFunction = (data) => {
            if (!this.storageService.getItem('ls.stakeholder')) {
                return;
            }
            let authToken = this.storageService.getItem('ls.authToken');
            let partialAuth = (!!authToken) ? authToken.substring(0, 5) : '';
            let loc = window.location;
            let stakeholderEmail = JSON.parse(this.storageService.getItem('ls.stakeholder')).email;
            let emailDomain = stakeholderEmail.replace(/.*@/, '');
            let metricUrl = loc.protocol + '//' + loc.host + '/metrics/' + partialAuth
                + '/' + (Date.now() - start) + '/' + method + getLocation(data.url).pathname + '?user_email_domain=' + emailDomain;
            http.get(metricUrl)
                .subscribe(() => { /*no op*/
                    },
                    () => { /*no op*/
                    });
        };

        return logFunction;
    }


    get(path: string, isAbsoluteUrl?: boolean): Observable<Response> {
        let url = isAbsoluteUrl ? path : this.pathRoot + path;
        let now = Date.now();
        let metrics = this.logMetrics('get', this.http, now);
        return this.http.get(url, this.requestOptions)
            .do(metrics, metrics);
    }

    getNoHeaders(path: string, isAbsoluteUrl?: boolean): Observable<Response> {
        let url = isAbsoluteUrl ? path : this.pathRoot + path;
        let now = Date.now();
        return this.http.get(url)
            .do(this.logMetrics('get', this.http, now), this.logMetrics('get', this.http, now));
    }

    getNoAcceptRequestHeader(path: string, isAbsoluteUrl?: boolean): Observable<Response> {
        let url = isAbsoluteUrl ? path : this.pathRoot + path;
        let now = Date.now();
        let headers = new Headers({
            'AUTHORIZATION': 'Token ' + this.storageService.getItem('ls.authToken'),
            'Content-Type': 'application/json'
        });
        this.requestOptions = new RequestOptions({'headers': headers});
        return this.http.get(url, this.requestOptions)
            .do(this.logMetrics('get', this.http, now), this.logMetrics('get', this.http, now));
    }


    put(path: string, data: any): Observable<Response> {
        return this.http.put(this.pathRoot + path, JSON.stringify(data), this.requestOptions);
    }

    post(path: string, data: any): Observable<Response> {
        let now = Date.now();
        return this.http.post(this.pathRoot + path, JSON.stringify(data), this.requestOptions);
        //.do(this.logMetrics('post', this.http, now), this.logMetrics('post', this.http, now));
    }

    getPaged<T>(path: string): Observable<Array<T>> {
        let subject = new Subject<Array<T>>();
        this.recursiveGet(this.pathRoot + path, subject, Date.now());
        return subject.asObservable();
    }

    remove(path: string): Observable<Response> {
        let now = Date.now();
        return this.http.delete(this.pathRoot + path, this.requestOptions)
            .do(this.logMetrics('delete', this.http, now), this.logMetrics('delete', this.http, now));
    }

    patch(path: string, data?: any): Observable<Response> {
        let now = Date.now();
        return this.http.patch(this.pathRoot + path, JSON.stringify(data), this.requestOptions)
            .do(this.logMetrics('patch', this.http, now), this.logMetrics('patch', this.http, now));
    }

    patchFile(path: string, file: File) {
        let options = new RequestOptions({
            headers: new Headers({
                'AUTHORIZATION': 'Token ' + this.storageService.getItem('ls.authToken')
            })
        });

        let formFile = new FormData();

        formFile.append('file', file);
        formFile.append('file_name', file.name);

        return this.http.patch(this.pathRoot + path, formFile, options);
    }

    postFile(path: string, file: File, author?: string, type?: string) {
        let options = new RequestOptions({
            headers: new Headers({
                'AUTHORIZATION': 'Token ' + this.storageService.getItem('ls.authToken')
            })
        });

        let formFile = new FormData();

        formFile.append('file', file);
        formFile.append('file_name', file.name);

        if (author) {
            formFile.append('author', author);
        }
        if (type) {
            formFile.append('file_type', type);
        }

        return this.http.post(this.pathRoot + path, formFile, options);
    }

    private recursiveGet(url: string, subject: Subject<any>, start: number): void {
        this.http.get(url, this.requestOptions)
            .subscribe(response => {
                let data = response.json();
                subject.next(data.results);
                if (data.next) {
                    this.recursiveGet(data.next, subject, start);
                } else {
                    this.logMetrics('get', this.http, start)(response);
                    subject.complete();
                    subject.unsubscribe();
                }
            });
    }


    private getHeaders(): Headers {
        let headers: Headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        console.log('initial header setting.');

        if (this.storageService.getItem('ls.authToken')) {
            console.log('2nd setting with token ' + this.storageService.getItem('ls.authToken'));
            headers = new Headers({
                'AUTHORIZATION': 'Token ' + this.storageService.getItem('ls.authToken'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            });
        }

        return headers;
    }
}
