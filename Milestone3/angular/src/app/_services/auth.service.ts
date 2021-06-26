import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  register(username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password,
      role
    }, httpOptions);
  }

  update(username: string, email: string, newpassword:string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'update', {
      username,
      email,
      newpassword,
      password,
    }, httpOptions);
  }

  list(animalName: string, species: string, description: string): Observable<any> {
    return this.http.post(AUTH_API + 'list', {
      animalName,
      species,
      description
    }, httpOptions);
  }

  refreshUser(){
    return this.http.get(AUTH_API + 'refresh');
  }

  getAllAnimals(): Observable<any> {
    return this.http.get(AUTH_API + 'getAnimals');
  }


  getAnimal(animalId: string): Observable<any> {
    return this.http.post(AUTH_API + 'animal', {
        animalId,
      }, httpOptions);
    }

  getUserAnimals(): Observable<any> {
    return this.http.get(AUTH_API + 'getUserAnimals');
  }

  deleteAnimal(animalId: string): Observable<any> {
    return this.http.post(AUTH_API + 'deleteAnimal', {
        animalId,
      }, httpOptions);
    }

  adoptAnimal(animalId: string): Observable<any> {
    return this.http.post(AUTH_API + 'adoptAnimal', {
        animalId,
      }, httpOptions);
    }

  claimToken(lastClaimed: number): Observable<any> {
    return this.http.post(AUTH_API + 'claimToken', {
      lastClaimed,
  }, httpOptions);
}
  

}

