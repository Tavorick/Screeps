var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.repair
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
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
                var targets = creep.room.find(FIND_STRUCTURES,{ filter: (structure) => {return (structure.hits <= 100000 && structure.structureType == STRUCTURE_WALL) 
                || (structure.hits < structure.hitsMax && !structure.structureType == STRUCTURE_WALL); }});
               
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) 
                {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
	        
	           var targets = creep.room.find(FIND_STRUCTURES, 
	           {
                    filter: (structure) => 
                    {
                        return structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 200 ;
                    }
	           });
	           if (targets.length > 0) 
	           {
	               creep.say('Picking up')
	               if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                    {
                        creep.moveTo(targets[0]);
	                }
	           }
	       else
	       {
                if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) == ERR_NOT_IN_RANGE) 
                    {
                        
                        creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
                    }
	       }
	    }
        
	}
};

module.exports = roleBuilder;