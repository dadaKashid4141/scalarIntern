import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, listAll } from 'firebase/storage';
import { getDownloadURL } from 'firebase/storage';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  uplodedData: any = [];
  storages = getStorage();
  listRef = ref(this.storages, 'uploads');
  title: string = '';
  imageUrls: any[] = []
  storag = getStorage();
  isLoading: boolean = true; 

  myUrl = '';

// fetch all files 
  fetchImageUrls() {
    const storageRef = this.storage.ref("uploads");

    storageRef.listAll().subscribe(result => {
      this.imageUrls = []; // Clear the existing array fro avoid repetatin of list of file
      result.items.forEach(itemRef => {
        itemRef.getMetadata().then(metadata => {
          const originalFilename = metadata.name;
          itemRef.getDownloadURL().then(url => {
            this.imageUrls.push({ url, originalFilename });
          });
        });
      });
      this.isLoading=false;
    });
  }
  constructor(private storage: AngularFireStorage) {
    this.fetchImageUrls();
  }
 
  //download on click

  downloadImage(imageUrl: string, originalFilename: string): void {
    this.isLoading = true; // Set loading state

    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);

        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = originalFilename;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isLoading = false; 

      })
      .catch((error) => {
        console.error('Error downloading file:', error);
        this.isLoading = false; 

      });
    // const link = document.createElement('a');
    // link.href = imageUrl;
    // link.target = '_blank';
    // link.download = 'firebase_image.jpg'; // You can customize the file name here
    // link.click();
  }
  selectedFile: File | null = null;
  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0];
  }
  // uploading files

  uploadFile() {
    if (this.selectedFile) {
      const filePath = 'uploads/' + this.selectedFile.name;
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().subscribe((snapshot) => {
        if (snapshot?.state === 'success') {
          this.title = `Your file - ${this.selectedFile?.name} is successfully uploaded`;
          console.log(
            // `Your file - ${this.selectedFile?.name} is successfully uploaded`
          );
          this.uplodedData.push(this.selectedFile?.name);
          console.log("Uploaded files", this.uplodedData);
          this.fetchImageUrls(); //for loading all new file on ui
        }
      });
    } else {
      console.log('No file selected');
    }
  }

  // downloading.. Here is direct opninng


  // downloadFile(fileName: string) {
  //   debugger;
  //   const storage = getStorage();
  //   const fileRef = ref(storage, 'uploads/' + fileName);
  //   getDownloadURL(fileRef)
  //     .then((url) => {

  //       return fetch(url, { mode: 'no-cors' });
  //     })
  //     .then((response) => {
  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const link = document.createElement('a');
  //       link.href = window.URL.createObjectURL(blob);

  //       // Extract the file name from the URL
  //       const fileName = fileRef.name; // Use the fileRef name
  //       link.download = fileName;

  //       link.style.display = 'none';
  //       document.body.appendChild(link);

  //       link.click();

  //       // Clean up
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(link.href);
  //     })
  //     .catch((error) => {
  //       console.error('Error downloading file:', error);
  //     });
  // }


}
