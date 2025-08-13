import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatValidateAddressDirective } from "./directives/address-validator/mat-address-validator.directive";
import { MatGoogleMapsAutocompleteDirective } from "./directives/mat-google-maps-autocomplete.directive";
import { ApiKeyToken } from "./tokens";

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
    MatValidateAddressDirective,
  ],
  declarations: [
    MatGoogleMapsAutocompleteDirective,
    MatValidateAddressDirective,
  ],
  providers: [
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => MatGoogleMapsAutocompleteDirective),
    //   multi: true
    // }
  ],
})
export class MatGoogleMapsAutocompleteModule {
  constructor() { }

  static forRoot(
    apiKey: string
  ): ModuleWithProviders<MatGoogleMapsAutocompleteModule> {
    return {
      ngModule: MatGoogleMapsAutocompleteModule,
      providers: [
        {
          provide: ApiKeyToken,
          useValue: apiKey,
        },
      ],
    };
  }
}
