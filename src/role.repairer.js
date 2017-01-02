module.exports =
    {
        /** @param {Creep} creep **/
        run: function(creep)
        {
            if(creep.memory.repairing && creep.carry.energy == 0)
            {
                creep.memory.repairing = false;
                creep.say('harvesting');
            }
            if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.repairing = true;
            }

            if (creep.memory.repairing)
            {
                creep.say('repairing');
                let targets = creep.room.find(FIND_STRUCTURES,{ filter: (structure) =>
                structure.hits < structure.hitsMax });
                let target;
                for (let i in targets)
                {
                    let structure = targets[i];
                    if (targets[i].structureType == STRUCTURE_WALL && targets[i].hits < 100000)
                    {
                        target = targets[i];
                        break;
                    }
                    target = structure;
                }
                if (creep.repair(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }
            else
            {
                creep.getEnergy();
            }
        }
    };


