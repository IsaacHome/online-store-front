import { Component, OnInit } from '@angular/core';
import {Product} from '../../models/product-model';
import {CartService} from '../../services/cart.service';
import {ShippingAddress} from '../../models/shipping-address-model';
import {ShippingService} from '../../services/shipping.service';
import {OrderDto} from '../../models/order-model-dto';
import {CheckOutService} from '../../services/check-out.service';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {


    products:Product[]=[];
    totalPrice: number=0;
    isAddress:boolean ;
    shippingAddress : ShippingAddress =new ShippingAddress();
    orderDTO: OrderDto =new OrderDto();


    constructor(private cartService:CartService,
                private shippingService:ShippingService,
                private checkOutService:CheckOutService,
                private router:Router,
                private dialog:MatDialog) { }

    ngOnInit() {
      this.products= this.cartService.getCarts();
      this.products.forEach( value => {
        this.totalPrice +=  value.price
      });
    }

    onDone(shippingAddress) {
        this.shippingAddress=shippingAddress
         this.isAddress = true;

    }

    edit() {
       this.shippingAddress = this.shippingService.getShipping();
       this.isAddress= false
    }

    onConfirm(){
      this.orderDTO.products =this.products;
      this.orderDTO.shippingAddress = this.shippingAddress;
      this.openDialog();

    }


    openDialog() {
      let dialog= this.dialog.open(DialogResultExampleDialog);
      dialog.afterClosed().subscribe(result =>{
           if (result == 'OK') {
              this.checkOutService.createOrder(this.orderDTO).subscribe( res => console.log(res));
           }else {
              this.router.navigate(['/productList'])
           }
      });


    }



}


@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html'
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogResultExampleDialog>) {}
}
