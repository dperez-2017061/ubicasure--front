import { Component, OnInit } from '@angular/core';
import { StationModel } from 'src/app/models/direction.model';
import { StationRestService } from 'src/app/services/directionRest/direction-rest.service';
import { UserRestService } from 'src/app/services/userRest/user-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bomberos-voluntarios',
  templateUrl: './bomberos-voluntarios.component.html',
  styleUrls: ['./bomberos-voluntarios.component.css']
})
export class BomberosVoluntariosComponent implements OnInit {
  map: any;
  marker = new google.maps.Marker;
  markerD: any;
  directionModel: StationModel;
  directionUpdated: any;
  direction: any;
  infoWindow: any;
  open: any;
  listener: any;
  role: any;
  id: any;
  locations: any[] = []
  popup: any;
  station: any;
  interval: any;
  timer: any;
  condT: any;
  local: any;
  markers: any = [];
  popups: any = [];
  continue: any = true;

  constructor(
    private stationRest: StationRestService,
    private userRest: UserRestService
  ) {
    this.directionModel = new StationModel('', 0, 0, '');
  }

  ngOnInit(): void {
    if (localStorage.getItem('ubication')) {
      let storage: any = localStorage.getItem('ubication')
      this.directionUpdated = JSON.parse(storage)
    }

    this.role = this.userRest.getIdentity().role;

    if (this.role == 'ADMIN') {
      localStorage.removeItem('timer')
      localStorage.removeItem('ubication')
      this.local = undefined
    } else {
      this.local = localStorage.getItem('timer')
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var map = new google.maps.Map(document.getElementById('map') as HTMLElement,
          {
            zoom: 17,
            center: pos,
            mapId: '8cd223e380b549d0'
          });

        this.initMap(map);
        this.set(map);

        const locationButton = document.getElementById('center') as HTMLButtonElement
        locationButton.classList.add("custom-map-control-button");
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

        locationButton.addEventListener("click", () => {
          map.setOptions({
            center: pos,
            zoom: 17
          })
        })

        let agregar = document.getElementById('policeButton') as HTMLButtonElement;
        let agregarB = document.getElementById('fireButton') as HTMLButtonElement;

        if (agregar && agregarB) {
          agregar.classList.add("custom-map-control-button");
          map.controls[1].push(agregar);

          agregarB.classList.add("custom-map-control-button");
          map.controls[2].push(agregarB);

          agregar.addEventListener('click', () => {

            this.directionModel = {
              _id: '',
              latitude: pos.lat,
              longitude: pos.lng,
              message: 'Ayuda policía'
            }
            if (!this.markerD && this.continue) {
              this.createDirection()
            }
          })

          agregarB.addEventListener('click', () => {
            this.directionModel = {
              _id: '',
              latitude: pos.lat,
              longitude: pos.lng,
              message: 'Ayuda bomberos'
            }

            if (!this.markerD && this.continue) {
              this.createDirection()
            }
          })
        }
      })

    if (this.local) {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.timer = Number(this.local)

      var interval = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            this.updateDirection(pos)
          }
        )
        this.timer = this.timer - 1000

        if (this.condT) {
          if (!localStorage.getItem('timer')) {
            clearInterval(interval)
          }
        }

        if (this.timer == 0) {
          localStorage.removeItem('timer')
          localStorage.removeItem('ubication')
        } else {
          localStorage.setItem('timer', this.timer)
          this.condT = true
        }
      }, 1000)

      this.interval = interval
      setTimeout(() => {
        clearInterval(this.interval)
      }, this.timer)
    } else {
      this.getDirections()
    }
  }

  set(map: any) {

    this.map = map;
  }

  createDirection() {
    this.stationRest.createDirection(this.directionModel).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: res.message,
          icon: 'success',
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        this.continue = false
        this.directionModel._id = res.direction._id;
        this.getDirection(this.map, res.direction._id);
        localStorage.setItem('ubication', JSON.stringify(res.direction));

        this.timer = 7200000
        if (this.interval) {
          clearInterval(this.interval)
        }

        var interval = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              this.updateDirection(pos)
            }
          )
          this.timer = this.timer - 1000

          if (this.condT) {
            if (!localStorage.getItem('timer')) {
              clearInterval(interval)
            }
          }

          if (this.timer == 0) {
            localStorage.removeItem('timer')
            localStorage.removeItem('ubication')
          } else {
            localStorage.setItem('timer', this.timer)
            this.condT = true
          }
        }, 1000)

        this.interval = interval

        setTimeout(() => {
          clearInterval(this.interval)
        }, this.timer)
      },
      error: (err) => {
        console.error();
      }
    })
  }

  updateDirection(pos: any) {
    this.stationRest.updateDirection(this.directionUpdated._id, pos).subscribe({
      next: (res: any) => {
        this.getDirection(this.map, this.directionUpdated._id)
      },
      error: (err) => {
        localStorage.removeItem('timer')
        localStorage.removeItem('ubication')
        clearInterval(this.interval)
        this.markerD.setMap(null)
        this.popup.close()
      }
    })
  }

  initMap(map: any) {
    var service;

    var coords = {
      lat: 14.6465219,
      lng: -90.5352448
    }
    var request: any = {
      location: coords,
      map,
      name: 'Bombero Voluntario',
      radius: 5000
    };
    var coords1 = {
      lat: 14.652111,
      lng: -90.593456
    }
    var request1: any = {
      location: coords1,
      map,
      name: 'Bombero Voluntario',
      radius: 4000
    };
    var coords2: any = {
      lat: 14.547564,
      lng: -90.562434
    };
    var request2: any = {
      location: coords2,
      map,
      name: 'Bombero Voluntario',
      radius: 4000
    };
    var coords3: any = {
      lat: 14.563847,
      lng: -90.487933
    };
    var request3: any = {
      location: coords3,
      map,
      name: 'Bombero Voluntario',
      radius: 4000
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request,
      (results: any, status: any) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            this.createMarkerV(results[i]);
          }
        }
      });

    service.nearbySearch(request1, (results: any, status: any) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
    service.nearbySearch(request2, (results: any, status: any) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
    service.nearbySearch(request3, (results: any, status: any) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          this.createMarkerV(results[i]);
        }
      }
    });
  }

  createMarkerV(place: google.maps.places.PlaceResult) {
    if (!place.geometry || !place.geometry.location) return;
    if (place.name?.toLowerCase().includes('bomberos municipales')) return;
    var infowindow: any;
    var map = this.map;
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: '../../assets/img/volunteerFire.png',
      optimized: true,
      animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, "click", () => {
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      let id: any = { placeId: place.place_id };

      new google.maps.places.PlacesService(map).getDetails(id, (result: any) => {
        if (!result.rating) {
          result.rating = ''
        } if (!result.formatted_phone_number) {
          result.formatted_phone_number = ''
        } else {
          result.formatted_phone_number = `<b>Télefono:</b> ${result.formatted_phone_number}`;
        } if (!result.rating || result.rating == undefined) {
          result.rating = ''
        } else {
          result.rating = `<b>Clasificación:</b> ${result.rating}`;
        } if (!result.opening_hours) {
          var horario = '';
          result.opening_hours = '';
        } else {
          horario = `<h3><b>Horario:</b></h3>`
          result.opening_hours = result.opening_hours.weekday_text;
          if (result.opening_hours.toString().includes(',')) {
            result.opening_hours = result.opening_hours.toString().replace(/,/g, '<br>');
          }

        }

        let content =
          `<h3><b>Nombre:</b> ${result.name}</h3>` +
          `<h3><b>Dirección:</b> ${result.adr_address}</h3>` +
          `<h3>${result.formatted_phone_number}</h3>` +
          `<h3>${result.rating}</h3>` +
          `${horario}<h4>${result.opening_hours}</h4>`
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(content);
        infowindow.open({
          anchor: marker,
          map
        });
        this.infoWindow = infowindow;
      });
    });
  }

  
  deleteDirectionAdmin() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.stationRest.deleteDirection(this.station._id).subscribe({
          next: (res: any) => {
            Swal.fire({
              title: 'Deleted!',
              text: res.message,
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
              timerProgressBar: true
            });
            for (let i = 0; i < this.markers.length; i++) {
              this.markers[i].setMap(null);
              this.popups[i].setMap(null)
            }
            this.getDirections();
          },
          error: (err) => {
            Swal.fire({
              title: err.error.message || err.error,
              icon: 'error',
              position: 'center',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
          }
        });
      }
    })
  }

  createMarker(place: any, location: any, map: any) {

    var loc = {
      lat: location.latitude,
      lng: location.longitude
    }

    if (this.directionUpdated) {
      if (place._id == this.directionUpdated._id) {
      } else {
        var marker = new google.maps.Marker({
          map,
          position: loc,
          icon: '../../../assets/img/ubication.png',
          animation: google.maps.Animation.DROP,
          optimized: true,
          zIndex: 5000
        });

        var popup = new google.maps.InfoWindow({
          content: place.message + '</strong>',
          position: loc
        });

        popup.open({
          anchor: marker,
          map
        });

        this.popup = popup
        this.markers.push(marker)
        this.popups.push(popup)

        if (this.role == 'ADMIN') {
          google.maps.event.addListener(marker, "click", () => {
            if (this.popup) {
              this.popup.close()
            }
            var info = new google.maps.InfoWindow()
            this.popup = info;
            let content =
              `<button id="delete" type="button" class="btn btn-danger ms-3">Borrar</button>`
            info.setContent(content)
            info.open({
              anchor: marker,
              map
            })
            setTimeout(() => {
              document.getElementById('delete')?.addEventListener("click", () => {

                this.station = place;
                this.open = marker;

                this.deleteDirectionAdmin();
              })
            }, 500)
          })
        }
      }
    } else {
      var marker = new google.maps.Marker({
        map,
        position: loc,
        icon: '../../../assets/img/ubication.png',
        animation: google.maps.Animation.DROP,
        optimized: true,
        zIndex: 5000
      });

      var popup = new google.maps.InfoWindow({
        content: place.message + '</strong>',
        position: loc
      });

      popup.open({
        anchor: marker,
        map
      });

      this.popup = popup
      this.markers.push(marker)
      this.popups.push(popup)

      if (this.role == 'ADMIN') {
        google.maps.event.addListener(marker, "click", () => {
          if (this.popup) {
            this.popup.close()
          }
          var info = new google.maps.InfoWindow()
          this.popup = info;
          let content =
            `<button id="delete" type="button" class="btn btn-danger ms-3">Borrar</button>`
          info.setContent(content)
          info.open({
            anchor: marker,
            map
          })
          setTimeout(() => {
            document.getElementById('delete')?.addEventListener("click", () => {

              this.station = place;
              this.open = marker;

              this.deleteDirectionAdmin();
            })
          }, 500)
        })
      }
    }
  }

  getDirections() {
    this.stationRest.getDirections().subscribe({
      next: (res: any) => {
        for (let direction of res.directions) {
          var location = {
            latitude: direction.latitude,
            longitude: direction.longitude
          }
          this.createMarker(direction, location, this.map);
        }
        if (res.cond) {
          for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
            this.popups[i].setMap(null)
          }
        }
      },
      error: (err) => {

      }
    });
  }

  getDirection(map: any, id: any) {
    this.stationRest.getDirection(id).subscribe({
      next: (res: any) => {
        var direction = res.direction
        var loc = {
          lat: direction.latitude,
          lng: direction.longitude
        }

        this.directionUpdated = direction

        if (this.markerD) {
          if (this.markerD.position) {
            if ((this.markerD.position.lat() == direction.latitude && this.markerD.position.lng() == direction.longitude)) {
            } else {
              this.markerD.setPosition(loc)
              this.popup.setPosition(loc)
            }
          }
        } else {
          var marker = new google.maps.Marker({
            map,
            position: loc,
            icon: '../../../assets/img/ubication.png',
            animation: google.maps.Animation.DROP,
            optimized: true,
            zIndex: 5000
          });

          var popup = new google.maps.InfoWindow({
            content: direction.message + '</strong>',
            position: loc
          });

          popup.open({
            anchor: marker,
            map
          });
          this.markerD = marker
          this.popup = popup
        }
      },
      error: (err) => {
        localStorage.removeItem('timer')
        localStorage.removeItem('ubication')
        clearInterval(this.interval)
        this.markerD.setMap(null)
        this.popup.close()
      }
    });
  }
}