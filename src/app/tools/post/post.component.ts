import { Component, Input, OnInit } from '@angular/core';
import { PostData } from 'src/app/pages/post-feed/post-feed.component';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
import { ReplyComponent } from '../reply/reply.component';
import { AuthdataService } from 'src/app/authdata.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postData?: PostData;
  creatorName: string = "";
  creatorDescription: string = "";
  firesotre = new FirebaseTSFirestore();
  str: string = "";

  isLiked = false;
  isDisliked = false;

  constructor(private dialog: MatDialog, private userid: AuthdataService) { }

  ngOnInit(): void {
    this.getCreatorInfo();

    this.checkLikedStatus();
    this.checkDislikedStatus();

  }


  checkLikedStatus() {
    let postid = "";
    if (this.postData != null) {
      postid = this.postData.postId;
    }

    this.firesotre.getCollection(
      {
        path: ["Likes", postid, this.userid.getUid()],
        where: [

        ],
        onComplete: (result) => {
          if (result.empty) {
            console.log("Object is null");
            this.isLiked = false;
          } else {
            console.log("Liked Status " + result);
            this.isLiked = true;

          }

        },
        onFail: err => {

        }
      }
    );

  }

  checkDislikedStatus() {
    let postid = "";
    if (this.postData != null) {
      postid = this.postData.postId;
    }

    this.firesotre.getCollection(
      {
        path: ["Dislikes", postid, this.userid.getUid()],
        where: [],

        onComplete: (result) => {
          if (result.empty) {
            console.log("Object is null");
            this.isDisliked = false;
          } else {
            console.log("Liked Status " + result);
            this.isDisliked = true;

          }

        },
        onFail: err => {

        }
      }
    );

  }



  onReplyClick() {
    this.dialog.open(ReplyComponent, { data: this.postData?.postId });
  }

  getCreatorInfo() {
    if (this.postData != null) {
      this.str = this.postData.creatorId;
    }
    this.firesotre.getDocument(
      {
        path: ["Users", this.str],
        onComplete: result => {
          let userDocument = result.data();
          if (userDocument != null) {
            this.creatorName = userDocument.publicName;
            this.creatorDescription = userDocument.description;
          }
        }
      }
    );
  }



  likeButtonClick() {
    let postid = "";
    if (this.postData != null) {
      postid = this.postData.postId;
    }
    if (this.isDisliked == true) {
      this.dislikeButtonClick();
    }
    if (this.isLiked == false) {
      this.firesotre.create(
        {
          path: ["Likes", postid, this.userid.getUid(), this.userid.getUid()],
          data: {
            userId: true
          },
          onComplete: (docId) => {
            this.isLiked = true;
            if (this.postData?.likes != null) {
              this.postData.likes += 1;
              this.updateLikes();
            }

            alert("you liked the post");
          },
          onFail: (err) => {
            alert("Failed to store comment");
          }
        }
      );
    } else {
      this.firesotre.delete(
        {
          path: ["Likes", postid, this.userid.getUid(), this.userid.getUid()],
          onComplete: () => {
            this.isLiked = false;
            if (this.postData?.likes != null) {
              this.postData.likes -= 1;
              this.updateLikes();
            }
            alert("Your like has been removed");
          }
        }
      );
    }

  }


  dislikeButtonClick() {

    let postid = "";
    if (this.postData != null) {
      postid = this.postData.postId;
    }
    if (this.isLiked == true) {
      this.likeButtonClick();
    }
    if (this.isDisliked == false) {
      this.firesotre.create(
        {
          path: ["Dislikes", postid, this.userid.getUid(), this.userid.getUid()],
          data: {
            userId: true
          },
          onComplete: (docId) => {
            this.isDisliked = true;
            if (this.postData?.dislikes != null) {
              this.postData.dislikes += 1;
              this.updateLikes();
            }
            alert("you disliked the post");
          },
          onFail: (err) => {
            alert("Failed to store comment");
          }
        }
      );
    } else {
      this.firesotre.delete(
        {
          path: ["Dislikes", postid, this.userid.getUid(), this.userid.getUid()],
          onComplete: () => {
            this.isDisliked = false;
            if (this.postData?.dislikes != null) {
              this.postData.dislikes -= 1;
              this.updateLikes();
            }
            alert("Your dislike has been removed");
          }
        }
      );
    }

  }

  updateLikes() {
    let postid = "";
    if (this.postData != null) {
      postid = this.postData.postId;
    }

    this.firesotre.create(
      {
        path: ["Posts", postid],
        data: {
          ...this.postData
        },
        onComplete: (docId) => {

        },
        onFail: (err) => {
          alert("Failed to store comment");
        }
      }
    );

  }



}
