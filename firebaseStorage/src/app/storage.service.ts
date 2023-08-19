import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}
  uploadFile(file: File): Observable<number | undefined> {
    const filePath = 'images/' + file.name;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return uploadTask.percentageChanges();
  }

  downloadFile(filePath: string): Observable<string | null> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  deleteFile(filePath: string): Observable<void> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.delete();
  }
  getFileDownloadURL(filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  getFileMetadata(filePath: string): Observable<any> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getMetadata();
  }
}
