// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * Listens for new members added to /teamProfile/:teamId/teamMembers/:memberId and creates a
 * new user, then adds a user profile at /userProfile/:iserId
 * The {teamId} and the {memberId} variables are part of event.params.
 * And the object inside the /:memberId reference can be accessed via event.data.val()
 */
exports.createTeamMember = functions.database.ref('/teamProfile/{teamId}/teamMembers/{memberId}')
  .onWrite( event => {
    // If the member is updated instead of created exit the function.
    if (event.data.previous.exists()) {
      console.log("User edited, exiting the function now");
      return; 
    }
    
    // Access the parent node to get the Team's name.
    console.log("Accessing parent ref");
    return event.data.adminRef.parent.parent.child("teamName").once('value', snapshot => {
      const teamId = event.params.teamId;
      const memberId = event.params.memberId;
      const email = event.data.val().email;
      const fullName = event.data.val().fullName;
      const teamName = snapshot.val();

      console.log("Creating user...");
      return admin.auth().createUser({
        uid: memberId,
        email: email,
        password: "123456789",
        displayName: fullName
      })
      .then( newUserRecord => {
        console.log("Creating user profile...");
        return admin.database().ref(`/userProfile/${memberId}`).set({
          fullName: fullName,
          email: email,
          teamAdmin: false,
          teamId: teamId,
          teamName: teamName
        })
      });
    }).catch((error) => { console.error("Error creating new user:", error); });
});