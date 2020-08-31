import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  /**
   *  Creates a new board for the user
   */
  async createBoard(data: Board): Promise<DocumentReference> {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Your first Kanban card!', label: 'yellow'}]
    });
  }

  /**
   *  Deletes the board
   */
  deleteBoard(boardId: string): Promise<void> {
    return this.db
        .collection('boards')
        .doc(boardId)
        .delete();
  }

  /**
   *  Updates the tasks on the board
   */
  updateTasks(boardId: string, tasks: Task[]): Promise<void> {
    return this.db
        .collection('boards')
        .doc(boardId)
        .update({tasks});
  }

  /**
   *  Removes the selected task from the board
   */
  removeTask(boardId: string, task: Task): Promise<void> {
    return this.db
        .collection('boards')
        .doc(boardId)
        .update({
          tasks: firebase.firestore.FieldValue.arrayRemove(task)
        });
  }

  /**
   *  Get boards associated to the user
   */
  getUserBoards() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
              .collection<Board>('boards', ref=>
                ref.where('uid', '==', user.uid).orderBy('priority')
              )
              .valueChanges({ idField: 'id'});
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Run a batch write to change prio of each board for sorting
   */
  sortBoards(boards: Board[]): void {
    const db = firebase.firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, {priority: idx}));
    batch.commit();
  }

}
