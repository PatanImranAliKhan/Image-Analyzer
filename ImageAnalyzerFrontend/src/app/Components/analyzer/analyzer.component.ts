import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analyzer',
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.css'],
})
export class AnalyzerComponent implements OnInit {
  public imageURL: any = '';
  public imageFile: any;
  public Response: any;
  public receiveResult = false;
  public loading: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loading = false;
  }

  /**
   * Function called whenever the Image file has been changes or inserted
   */
  ImageChange(event: any) {
    this.imageURL = event.target.file;
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.imageURL = e.target?.result;
      };
    }
  }

  AnalyzeImage() {
    if (this.imageURL != '') {
      this.loading = true;
      const formData = new FormData();
      formData.append("file", this.imageFile, this.imageFile.name);

      this.http
        .post('http://localhost:5000/upload', formData)
        .subscribe((resp: any) => {
          this.Response = JSON.parse(resp);
          this.AnalyzeResult();
        }, (err) => {
          this.loading = false;
          this.receiveResult = false;
          this.Response = "";
          alert("Error in Processing the request")
        });
    }
  }

  AnalyzeResult() {
    console.log(this.Response);
    switch (this.Response.Status) {
      case "Error":
        this.receiveResult = false;
        alert(this.Response.Message)
        break;
      case "Prediction Error":
        this.receiveResult = true;
        alert(this.Response.Message);
        break;
      default:
        this.receiveResult = true;
    }
    this.loading = false;
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    try {
      setTimeout(() => {
        if (document.getElementById('result')) {
          document.getElementById('result')?.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
          });
        }
      }, 1000);
    } catch (err) {
      console.log("scrolll error: " + err)
    }
  }
}
