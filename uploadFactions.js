import { db } from './firebase';

export default async function uploadFactions() {

    // Your data
    const factions = [
        {
            "name": "Space Marines",
            "description": "The Space Marines are the most elite and feared fighting forces of the Imperium.",
            "models": [
                {
                    "name": "Space Marine",
                    "gameData": {
                        "points": 10,
                        "movement": "6\"",
                        "weaponSkill": 3,
                        "ballisticSkill": 3,
                        "strength": 4,
                        "toughness": 4,
                        "wounds": 1,
                        "attacks": 1,
                        "leadership": 7,
                        "save": "3+",
                        "size": 25, 
                    },
                    "defaultWargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                },
                {
                    "name": "Space Marine Sergeant",
                    "gameData": {
                        "points": 15,
                        "movement": "6\"",
                        "weaponSkill": 3,
                        "ballisticSkill": 3,
                        "strength": 4,
                        "toughness": 4,
                        "wounds": 1,
                        "attacks": 2,
                        "leadership": 8,
                        "save": "3+",
                        "size": 25,
                    },
                    "defaultWargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                }
                // other models...
            ],
            "wargear": [
                {
                    "name": "Bolt Pistol",
                    "range": "12\"",
                    "type": "Pistol 1",
                    "strength": 4,
                    "armorPenetration": 0,
                    "damage": 1
                },
                {
                    "name": "Boltgun",
                    "range": "24\"",
                    "type": "Rapid Fire 1",
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
                // other wargear...
            ],
            "squads": [
                {
                    "name": "Tactical Squad",
                    "description": "Tactical Squads are the backbone of any Space Marine army. They hold ground; provide fire support; and even attack enemy lines.",
                    "isDeployed": false,
                    "rules": [
                        {
                            "name": "Space Marine",
                            "min": 4,
                            "max": 9,
                            "wargearOptions": [
                                {
                                    "for": "Space Marine",
                                    "if": { "condition": "lessThan", "value": 10 },
                                    "options": ["Heavy Bolter", "Plasma Gun"], // add the rest of the Heavy Weapons and Special Weapons lists here
                                    "replace": "Boltgun",
                                    "max": 1
                                },
                                {
                                    "for": "Space Marine",
                                    "if": { "condition": "equals", "value": 10 },
                                    "options": ["Heavy Bolter"], // add the rest of the Heavy Weapons list here
                                    "replace": "Boltgun",
                                    "max": 1                               
                                },
                                {
                                    "for": "Space Marine",
                                    "if": { "condition": "equals", "value": 10 },
                                    "options": ["Plasma Gun"], // add the rest of the Special Weapons list here
                                    "replace": "Boltgun",
                                    "max": 1                                
                                }
                            ]
                        },
                        {
                            "name": "Space Marine Sergeant",
                            "min": 1,
                            "max": 1,
                            "wargearOptions": [
                                {
                                    "for": "Space Marine Sergeant",
                                    "options": ["Bolt Pistol", "Chainsword"], // add the rest of the Pistols and Melee Weapons lists here
                                    "replace": "Bolt Pistol"
                                },
                                {
                                    "for": "Space Marine Sergeant",
                                    "options": ["Combi-weapon"], // add the rest of the Combi-weapons, Pistols and Melee Weapons lists here
                                    "replace": "Boltgun"
                                }
                            ]
                        }
                    ],
                    "models": [
                        {
                            "name": "Space Marine Sergeant",
                            "gameData": {
                                "points": 15,
                                "movement": "6\"",
                                "weaponSkill": 3,
                                "ballisticSkill": 3,
                                "strength": 4,
                                "toughness": 4,
                                "wounds": 1,
                                "attacks": 2,
                                "leadership": 8,
                                "save": "3+",
                                "size": 25,
                            },
                            "wargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                        },
                        {
                            "name": "Space Marine",
                            "gameData": {
                                "points": 10,
                                "movement": "6\"",
                                "weaponSkill": 3,
                                "ballisticSkill": 3,
                                "strength": 4,
                                "toughness": 4,
                                "wounds": 1,
                                "attacks": 1,
                                "leadership": 7,
                                "save": "3+",
                                "size": 25, 
                            },
                            "wargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                        },
                        {
                            "name": "Space Marine",
                            "gameData": {
                                "points": 10,
                                "movement": "6\"",
                                "weaponSkill": 3,
                                "ballisticSkill": 3,
                                "strength": 4,
                                "toughness": 4,
                                "wounds": 1,
                                "attacks": 1,
                                "leadership": 7,
                                "save": "3+",
                                "size": 25, 
                            },
                            "wargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                        },
                        {
                            "name": "Space Marine",
                            "gameData": {
                                "points": 10,
                                "movement": "6\"",
                                "weaponSkill": 3,
                                "ballisticSkill": 3,
                                "strength": 4,
                                "toughness": 4,
                                "wounds": 1,
                                "attacks": 1,
                                "leadership": 7,
                                "save": "3+",
                                "size": 25, 
                            },
                            "wargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                        },
                        {
                            "name": "Space Marine",
                            "gameData": {
                                "points": 10,
                                "movement": "6\"",
                                "weaponSkill": 3,
                                "ballisticSkill": 3,
                                "strength": 4,
                                "toughness": 4,
                                "wounds": 1,
                                "attacks": 1,
                                "leadership": 7,
                                "save": "3+",
                                "size": 25, 
                            },
                            "wargear": ["Bolt Pistol", "Boltgun", "Frag Grenades", "Krak Grenades"]
                        },

                    ],
                    "abilities": ["Angels of Death", "Combat Squads"]
                }
                // other squads...
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
