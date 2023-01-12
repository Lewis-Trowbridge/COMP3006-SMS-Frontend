import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { UserService } from '../user.service'

@Component({
  selector: 'app-add-editor-dialog',
  templateUrl: './add-editor-dialog.component.html',
  styleUrls: ['./add-editor-dialog.component.css']
})
export class AddEditorDialogComponent implements OnInit {
  userControl = new FormControl<string>('', { nonNullable: true })

  constructor (private readonly userService: UserService) { }

  ngOnInit (): void {
    this.userControl.valueChanges.subscribe(value => this.userService.search(value).subscribe(data => console.log(data)))
  }
}
