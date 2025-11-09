import { isPlatformBrowser } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  Validators,
} from "@angular/forms";
import { Location } from "../interfaces";
import PlaceResult = google.maps.places.PlaceResult;
import AutocompleteOptions = google.maps.places.AutocompleteOptions;

@Directive({
  selector: "[matGoogleMapsAutocomplete]",
  exportAs: "matGoogleMapsAutocomplete",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MatGoogleMapsAutocompleteDirective),
      multi: true,
    },
  ],
})
export class MatGoogleMapsAutocompleteDirective
  implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild("inputField")
  inputField!: ElementRef;

  autocomplete: google.maps.places.Autocomplete | undefined;

  @Input()
  address?: PlaceResult | string;

  @Input()
  country?: string | string[];

  @Input()
  placeIdOnly?: boolean;

  @Input()
  strictBounds?: boolean;

  @Input()
  types?: string[];

  @Input()
  type?: string;

  @Input()
  autoCompleteOptions: AutocompleteOptions = {};

  @Output()
  onChange: EventEmitter<PlaceResult | string | null> = new EventEmitter<
    PlaceResult | string | null
  >();

  @Output()
  onAutocompleteSelected: EventEmitter<PlaceResult> =
    new EventEmitter<PlaceResult>();

  @Output()
  onLocationSelected: EventEmitter<Location> = new EventEmitter<Location>();

  disabled?: boolean;

  _value?: string | undefined;

  get value(): string | undefined {
    return this._value;
  }

  @Input()
  set value(value: string | undefined) {
    this._value = value;
    this.propagateChange(this.value);
    this.cf.markForCheck();
  }

  propagateChange = (_: any) => { };

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    public elemRef: ElementRef,
    private cf: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnDestroy(): void {
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnInit(): void { }

  validate(fc: FormControl) {
    return fc.hasValidator(Validators.required) ? !!fc?.value : true;
  }

  @HostListener("change")
  onChangeInputValue(): void {
    const value = (this.elemRef.nativeElement as HTMLInputElement)?.value;
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_fn: any): void { }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
  }

  initMap() {
    if (isPlatformBrowser(this.platformId)) {
      const options: AutocompleteOptions = {
        // types: ['address'],
        // componentRestrictions: {country: this.country},
        placeIdOnly: this.placeIdOnly,
        strictBounds: this.strictBounds,
        types: this.types,
      };

      // tslint:disable-next-line:no-unused-expression
      this.country
        ? (options.componentRestrictions = { country: this.country })
        : null;
      // tslint:disable-next-line:no-unused-expression
      this.country ? (options.types = this.types) : null;

      this.autoCompleteOptions = Object.assign(
        this.autoCompleteOptions,
        options
      );

      const autocomplete = new google.maps.places.Autocomplete(
        this.elemRef.nativeElement,
        this.autoCompleteOptions
      );
      this.autocomplete = autocomplete;
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: PlaceResult = autocomplete.getPlace();

          this.value = place.formatted_address;
          this.address = place.formatted_address;
          this.onAutocompleteSelected.emit(place);
          if (place.geometry?.location != null) {
            this.onLocationSelected.emit({
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            });
          }
        });
      });
    }
  }
}
