var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    
    let roles = [
        { name: "upgrader",  roleDefinition: roleUpgrader,  desiredCount: 50, skills: [WORK, CARRY, CARRY, MOVE] },
        // { name: "builder",   roleDefinition: roleBuilder,   desiredCount: 1, skills: [WORK, WORK, CARRY, MOVE] },
        { name: "harvester", roleDefinition: roleHarvester, desiredCount: 1, skills: [WORK, WORK, CARRY, MOVE] },
    ];
    
    // Spawn new creeps, if needed
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (let role of roles) {
        let creepsOfRole = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
        
        if(creepsOfRole.length < role.desiredCount) {
            var newName = role.name + Game.time;
            console.log(`Spawning new ${role.name}: ` + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,WORK], newName, 
                {memory: {role: role.name}});
        }
    }

    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    var tower = Game.getObjectById('b7c1f078a3019cc5c787a7ed');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
