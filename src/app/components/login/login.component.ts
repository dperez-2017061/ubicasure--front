import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserModel;
  token:any;

  constructor(
    private userRest: UserRestService,
    public router:Router
  ) { 
    this.user = new UserModel('','','','','');
  }

  ngOnInit(): void {
  }

  login(){
    localStorage.clear()
    this.userRest.login(this.user).subscribe({
      next: (res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
        localStorage.setItem('token', res.token);
        localStorage.setItem('identity', JSON.stringify(res.user));
        this.router.navigateByUrl('/mapa');
      },
      error: (err)=> {
      Swal.fire({
        title: err.error.message || err.error,
        icon: 'error',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar:true
      })}
    })
  }

}
/* user: UserModel;
  timer:any;
  confirmPass:any = '';
  pass = '';

  constructor(
    private userRest: UserRestService,
    public router:Router
  ) { 
    this.user = new UserModel('','','','','','','');
  }

  ngOnInit(): void {
  }

  checkPass(){
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      if(this.confirmPass != this.user.password){
        Swal.fire({
          title: 'Password doesnt match',
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar:true
          })
        clearTimeout(this.timer);
        this.pass = ''
      }else{
        Swal.fire({
          title: 'Password match',
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar:true
          })
        clearTimeout(this.timer);
        this.pass = 'as'
      }
    }, 1000)
  }

  Cpass(){
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{
      if(this.confirmPass != this.user.password){
        clearTimeout(this.timer);
        this.pass = '';
      }else{
        clearTimeout(this.timer);
        this.pass = 'as';
      }
    }, 1000)
  }

  register(registerForm:any){
    this.userRest.register(this.user).subscribe({
      next: (res:any)=>{
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        }),
        registerForm.reset();
        this.router.navigateByUrl('/login');
      },
      error: (err)=> {
        console.error();
        Swal.fire({
          title:  err.error.message ||err.error ,
          icon: 'error',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar:true
        })
      }
    })
  } */