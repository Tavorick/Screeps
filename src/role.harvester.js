let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        this.AssignSource(creep);
	    if(creep.carry.energy < creep.carryCapacity) 
	    {
            let source = Game.getObjectById(creep.memory.assignedSource);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(source);
            }
        }
        else {
            let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length > 0) 
            {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == (STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity) 
                        ||STRUCTURE_TOWER && structure.energy < structure.energyCapacity )
                    }});
                  if (targets.length > 0) 
                  {
                      if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                      {
                        creep.moveTo(targets[0]);
                      }
                  }  
            }
        }
	},
	
	AssignSource: function(newcreep)
	{
	    if (newcreep.memory.assignedSource == null) 
	    {
            let room =  Game.rooms[newcreep.memory.spawnroom];
            let sources = room.find(FIND_SOURCES);

            let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	        for (let s in sources)
	        {
                let assignedMiners = 0;
	            for (let h in harvesters)
	            {
	                if (sources[s].id == harvesters[h].memory.assignedSource) 
	                {
	                    assignedMiners +=1;
	                }
	            }
	            if (assignedMiners < 2 ) 
	            {
	                 
	                newcreep.memory.assignedSource = sources[s].id;
	                return;
	            }
	        }
	    }
	}
};

module.exports = roleHarvester;
