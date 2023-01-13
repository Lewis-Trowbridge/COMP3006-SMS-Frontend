import { Component, Inject, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ShoppingListRESTService } from '../shopping-list-rest.service'
import { UserService } from '../user.service'

export interface AddEditorDialogData {
  listId: string
}

@Component({
  selector: 'app-add-editor-dialog',
  templateUrl: './add-editor-dialog.component.html',
  styleUrls: ['./add-editor-dialog.component.css']
})
export class AddEditorDialogComponent implements OnInit {
  userControl = new FormControl<string>('', { nonNullable: true })

  availableUsers: string[] = []

  errorMessage: string | undefined

  constructor (private readonly userService: UserService,
    private readonly shoppingListRestService: ShoppingListRESTService,
    private readonly dialogRef: MatDialogRef<AddEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: AddEditorDialogData) { }

  ngOnInit (): void {
    this.userControl.valueChanges
      .subscribe(value => this.userService.search(value)
        .subscribe(data => { this.availableUsers = data }))
  }

  addEditor (): void {
    this.shoppingListRestService.addEditor(this.data.listId, this.userControl.value)
      .subscribe((errorMessage) => {
        if (errorMessage === null) {
          this.dialogRef.close()
        } else {
          this.errorMessage = errorMessage
        }
      })
  }
}
