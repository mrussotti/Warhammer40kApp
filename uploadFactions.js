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
                        "save": "3+",
                        "size": 25, // Added size (in pixels)
                        "numModels": 10,  // Added number of models in a squad
                        "minSpaceMarine": 4,
                        "maxSpaceMarine": 9,
                        "minSpaceS": 4,
                    },
                    "wargear": [
                        {
                            "name": "Boltgun",
                            "range": "24\"",
                            "type": "Rapid Fire 1",
                            "strength": 4,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Bolt Pistol",
                            "range": "12\"",
                            "type": "Pistol 1",
                            "strength": 4,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Frag Grenades",
                            "range": "6\"",
                            "type": "Grenade D6",
                            "strength": 3,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Krak Grenades",
                            "range": "6\"",
                            "type": "Grenade 1",
                            "strength": 6,
                            "armorPenetration": -1,
                            "damage": "D3"
                        }
                    ],
                    "abilities": ["And They Shall Know No Fear", "Combat Squads", "Combat Tactics"]
                },
                {
                    "name": "Assault Squad",
                    "description": "Assault Squads make up the bulk of most Space Marine Chapters' assault forces.",
                    "gameData": {
                        "points": 90,
                        "movement": "12\"",
                        "weaponSkill": 3,
                        "ballisticSkill": 3,
                        "strength": 4,
                        "toughness": 4,
                        "wounds": 1,
                        "attacks": 1,
                        "leadership": 7,
                        "save": "3+",
                        "size": 25, // Added size (in pixels)
                        "numModels": 10  // Added number of models in a squad
                    },
                    "wargear": [
                        {
                            "name": "Chainsword",
                            "range": "Melee",
                            "type": "Melee",
                            "strength": "User",
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Bolt Pistol",
                            "range": "12\"",
                            "type": "Pistol 1",
                            "strength": 4,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Frag Grenades",
                            "range": "6\"",
                            "type": "Grenade D6",
                            "strength": 3,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Krak Grenades",
                            "range": "6\"",
                            "type": "Grenade 1",
                            "strength": 6,
                            "armorPenetration": -1,
                            "damage": "D3"
                        },
                        {
                            "name": "Jump Pack",
                            "description": "Allows the unit to move swiftly over the battlefield, ignoring terrain and other obstacles."
                        }
                    ],
                    "abilities": ["And They Shall Know No Fear", "Combat Squads", "Combat Tactics"]
                },
                {
                    "name": "Devastator Squad",
                    "description": "Devastator Squads provide a Space Marine Chapter with heavy fire support.",
                    "gameData": {
                        "points": 120,
                        "movement": "6\"",
                        "weaponSkill": 3,
                        "ballisticSkill": 3,
                        "strength": 4,
                        "toughness": 4,
                        "wounds": 1,
                        "attacks": 1,
                        "leadership": 8,
                        "save": "3+",
                        "size": 25, // Added size (in pixels)
                        "numModels": 10  // Added number of models in a squad
                    },
                    "wargear": [
                        {
                            "name": "Boltgun",
                            "range": "24\"",
                            "type": "Rapid Fire 1",
                            "strength": 4,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Bolt Pistol",
                            "range": "12\"",
                            "type": "Pistol 1",
                            "strength": 4,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Heavy Weapon",
                            "description": "Can be a variety of heavy weapons such as a Heavy Bolter, Missile Launcher, Lascannon, etc."
                        },
                        {
                            "name": "Frag Grenades",
                            "range": "6\"",
                            "type": "Grenade D6",
                            "strength": 3,
                            "armorPenetration": 0,
                            "damage": 1
                        },
                        {
                            "name": "Krak Grenades",
                            "range": "6\"",
                            "type": "Grenade 1",
                            "strength": 6,
                            "armorPenetration": -1,
                            "damage": "D3"
                        }
                    ],
                    "abilities": ["And They Shall Know No Fear", "Combat Squads", "Combat Tactics", "Signum"]
                }
            ]
        },
        // {
        //     "name": "Astra Militarum",
        //     "description": "The Astra Militarum, also known as the Imperial Guard, is the largest coherent fighting force in the galaxy.",
        //     "squads": [
        //         {
        //             "name": "Infantry Squad",
        //             "description": "The Infantry Squad is the backbone of the Astra Militarum, and is invariably the most commonly deployed type of soldier.",
        //             "gameData": {
        //                 "points": 40,
        //                 "movement": "6\"",
        //                 "weaponSkill": 4,
        //                 "ballisticSkill": 4,
        //                 "strength": 3,
        //                 "toughness": 3,
        //                 "wounds": 1,
        //                 "attacks": 1,
        //                 "leadership": 6,
        //                 "save": "5+"
        //             },
        //             "wargear": ["Lasgun", "Frag Grenades"],
        //             "abilities": ["Orders", "Voice of Command", "Combined Squads"]
        //         },
        //         {
        //             "name": "Heavy Weapons Squad",
        //             "description": "Heavy Weapons Squads provide fire support for Astra Militarum infantry units.",
        //             "gameData": {
        //                 "points": 60,
        //                 "movement": "6\"",
        //                 "weaponSkill": 4,
        //                 "ballisticSkill": 4,
        //                 "strength": 3,
        //                 "toughness": 3,
        //                 "wounds": 1,
        //                 "attacks": 1,
        //                 "leadership": 6,
        //                 "save": "5+"
        //             },
        //             "wargear": ["Lasgun", "Heavy Weapon", "Frag Grenades"],
        //             "abilities": ["Orders", "Voice of Command"]
        //         },
        //         {
        //             "name": "Special Weapons Squad",
        //             "description": "Special Weapons Squads are part of the Astra Militarum's specialized infantry and are tasked with carrying the regiment's heavy weaponry.",
        //             "gameData": {
        //                 "points": 70,
        //                 "movement": "6\"",
        //                 "weaponSkill": 4,
        //                 "ballisticSkill": 4,
        //                 "strength": 3,
        //                 "toughness": 3,
        //                 "wounds": 1,
        //                 "attacks": 1,
        //                 "leadership": 6,
        //                 "save": "5+"
        //             },
        //             "wargear": ["Lasgun", "Special Weapon", "Frag Grenades"],
        //             "abilities": ["Orders", "Voice of Command"]
        //         }
        //     ]
        // },
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
