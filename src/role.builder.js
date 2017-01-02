module.exports =
{

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	    if(creep.memory.building && creep.carry.energy == 0)
	    {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) 
	    {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) 
	    {
            if(targets.length > 0) 
            {
                creep.say('building');
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
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
	    }
	    else
        {
            creep.getEnergy(true,true);
	    }
        
	}
};

