import { db } from './firebase';

export default async function uploadFactions() {

// Your data
const factions = [
  {
    "name": "Space Marines",
    "description": "The Space Marines are the most elite and feared fighting forces of the Imperium.",
    "squads": [
      {
        "name": "Tactical Squad",
        "description": "Tactical Squads are the backbone of any Space Marine army. They hold ground; provide fire support; and even attack enemy lines.",
        "gameData": {
          "points": 100,
          "movement": "6\"",
          "weaponSkill": 3,
          "ballisticSkill": 3,
          "strength": 4,
          "toughness": 4,
          "wounds": 1,
          "attacks": 1,
          "leadership": 7,
          "save": "3+"
        }
      },
      // Add more squads here
    ]
  },
  {
    "name": "Chaos Space Marines",
    "description": "The Chaos Space Marines are the most feared of all the heretics. They are former Space Marines who have turned their back on the Imperium and now worship the Chaos Gods.",
    "squads": [
      {
        "name": "Chaos Tactical Squad",
        "description": "Chaos Tactical Squads are the backbone of any Chaos Space Marine army. They hold ground; provide fire support; and even attack enemy lines.",
        "gameData": {
          "points": 100,
          "movement": "6\"",
          "weaponSkill": 3,
          "ballisticSkill": 3,
          "strength": 4,
          "toughness": 4,
          "wounds": 1,
          "attacks": 1,
          "leadership": 7,
          "save": "3+"
        }
      },
      // Add more squads here
    ]
  },
  // Add more factions here
];

// Upload the data to Firestore
factions.forEach((faction) => {
  db.collection('factions').add(faction)
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
});

}