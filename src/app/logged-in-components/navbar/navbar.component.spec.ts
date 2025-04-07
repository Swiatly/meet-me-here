import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NavbarComponent ]
        }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    });

    it('should call function close modal when clicks close-button', waitForAsync(() => {
        spyOn(component, 'closeModal');
        let button = fixture.debugElement.nativeElement.querySelector('.close-button');
        button.click();
        fixture.whenStable().then(() => {
            expect(component.closeModal).toHaveBeenCalled();
        });
    }));
});

