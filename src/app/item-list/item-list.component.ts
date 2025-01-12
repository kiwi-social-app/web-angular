import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {


  items = [
    {id: 1, title: "title 1", content: "this is content 1"},
    {id: 2, title: "title 2", content: "this is content 2"},
    {id: 3, title: "title 3", content: "this is content 3"}
];

  constructor() { }

  ngOnInit(): void {
  }

}
