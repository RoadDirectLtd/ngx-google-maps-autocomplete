import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatGoogleMapsAutocompleteDirective } from "./directives/mat-google-maps-autocomplete.directive";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [
    MatGoogleMapsAutocompleteDirective,
  ],
  declarations: [
    MatGoogleMapsAutocompleteDirective,
  ],
})
export class MatGoogleMapsAutocompleteModule { }
