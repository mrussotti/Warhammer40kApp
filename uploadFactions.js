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
                },
                {
                    "name": "Rhino",
                    "gameData": {
                        "points": 70,
                        "movement": "12\"",
                        "weaponSkill": 6,
                        "ballisticSkill": 3,
                        "strength": 6,
                        "toughness": 7,
                        "wounds": 10,
                        "attacks": 3,
                        "leadership": 8,
                        "save": "3+",
                        "size": 100,
                    },
                    "defaultWargear": ["Storm Bolter", "Smoke Launchers"]
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
                },
                {
                    "name": "Storm Bolter",
                    "range": "24\"",
                    "type": "Rapid Fire 2",
                    "strength": 4,
                    "armorPenetration": 0,
                    "damage": 1
                },
                {
                    "name": "Smoke Launchers",
                    "range": "-",
                    "type": "Ability",
                    "effect": "Once per game, instead of shooting any weapons in the Shooting phase, this model can use its Smoke Launchers. Until your next Shooting phase, your opponent must subtract 1 from all hit rolls for ranged weapons that target this model."
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
                },
                {
                    "name": "Rhino Squad",
                    "description": "A Rhino Squad includes a Rhino transport vehicle along with a tactical Space Marine Squad.",
                    "isDeployed": false,
                    "rules": [
                        {
                            "name": "Rhino",
                            "min": 1,
                            "max": 1,
                            "wargearOptions": [
                                {
                                    "for": "Rhino",
                                    "add": ["Hunter-Killer Missile"],
                                    "max": 1
                                },
                                {
                                    "for": "Rhino",
                                    "options": ["Storm Bolter"],
                                    "max": 2
                                }
                            ]
                        },
                    ],
                    "models": [
                        {
                            "name": "Rhino",
                            "gameData": {
                                "points": 70,
                                "movement": "12\"",
                                "weaponSkill": 6,
                                "ballisticSkill": 3,
                                "strength": 6,
                                "toughness": 7,
                                "wounds": 10,
                                "attacks": 3,
                                "leadership": 8,
                                "save": "3+",
                                "size": 100,
                            },
                            "wargear": ["Storm Bolter", "Smoke Launchers"]
                        },
                        // add other models details here
                    ],
                    "abilities": ["Angels of Death", "Explodes"]
                }
                
                // other squads...
            ]
        },
        {
                "name": "Orks",
                "description": "The Orks are a savage and warlike race, known for their love of battle and destruction.",
                "models": [
                    {
                        "name": "Ork Boy",
                        "gameData": {
                            "points": 8,
                            "movement": "5\"",
                            "weaponSkill": "3+",
                            "ballisticSkill": "5+",
                            "strength": 4,
                            "toughness": 5,
                            "wounds": 1,
                            "attacks": 2,
                            "leadership": 6,
                            "save": "6+",
                            "size": 32
                        },
                        "defaultWargear": ["Slugga", "Choppa", "Stikkbombs"]
                    },
                    {
                        "name": "Boss Nob",
                        "gameData": {
                            "points": 8,
                            "movement": "5\"",
                            "weaponSkill": "3+",
                            "ballisticSkill": "5+",
                            "strength": 5,
                            "toughness": 5,
                            "wounds": 2,
                            "attacks": 3,
                            "leadership": 7,
                            "save": "6+",
                            "size": 32
                        },
                        "defaultWargear": ["Slugga", "Choppa", "Stikkbombs"]
                    },
                    // Add other Ork models here...
                ],
                "wargear": [
                    {
                        "name": "Slugga",
                        "range": "12\"",
                        "type": "Pistol 1",
                        "strength": 4,
                        "armorPenetration": 0,
                        "damage": 1
                    },
                    {
                        "name": "Choppa",
                        "range": "Melee",
                        "type": "Melee",
                        "strength": "User",
                        "armorPenetration": -1,
                        "damage": 1
                    },
                    {
                        "name": "Stikkbombs",
                        "range": "8\"",
                        "type": "Grenade D6",
                        "strength": 3,
                        "armorPenetration": 0,
                        "damage": 1,
                        "abilities": ["Blast"]
                    },
                    {
                        "name": "Big Shoota",
                        "range": "36\"",
                        "type": "Dakka 5/3",
                        "strength": 5,
                        "armorPenetration": 0,
                        "damage": 1
                    },
                    // Add other Ork wargear here...
                ],
                "squads": [
                    {
                        "name": "Ork Boyz Squad",
                        "description": "Ork Boyz are the foot soldiers of the Ork horde, armed with crude but deadly weapons.",
                        "isDeployed": false,
                        "rules": [
                            {
                                "name": "Ork Boy",
                                "min": 9,
                                "max": 29,
                                "wargearOptions": [
                                    {
                                        "for": "Ork Boy",
                                        "options": ["Shoota"],
                                        "replace": "Slugga"
                                    },
                                    {
                                        "for": "Ork Boy",
                                        "if": { "condition": "divisibleBy", "value": 10 },
                                        "options": ["Big Shoota", "Rokkit Launcha"],
                                        "replace": "Choppa"
                                    }
                                ]
                            },
                            {
                                "name": "Boss Nob",
                                "min": 1,
                                "max": 1,
                                "wargearOptions": [
                                    {
                                        "for": "Boss Nob",
                                        "options": ["Big Choppa", "Choppa", "Killsaw", "Power Klaw", "Power Stabba", "Slugga"],
                                        "replace": "Choppa"
                                    },
                                    {
                                        "for": "Boss Nob",
                                        "options": ["Kombi-Rokkit", "Kombi-Skorcha"],
                                        "replace": "Slugga"
                                    }
                                ]
                            }
                        ],
                        "models": [
                            {
                                "name": "Boss Nob",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 5,
                                    "toughness": 5,
                                    "wounds": 2,
                                    "attacks": 3,
                                    "leadership": 7,
                                    "save": "6+",
                                    "size": 32
                                },
                                "defaultWargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            {
                                "name": "Ork Boy",
                                "gameData": {
                                    "points": 8,
                                    "movement": "5\"",
                                    "weaponSkill": "3+",
                                    "ballisticSkill": "5+",
                                    "strength": 4,
                                    "toughness": 5,
                                    "wounds": 1,
                                    "attacks": 2,
                                    "leadership": 6,
                                    "save": "6+",
                                    "size": 32
                                },
                                "wargear": ["Slugga", "Choppa", "Stikkbombs"]
                            },
                            // Add more Ork Boyz here...
                        ],
                        "abilities": ["'Ere We Go", "Mob Rule", "Waaagh!"]
                    }
                    // Add other Ork squads here...
                ]
            },
            // Add more factions here...
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
