var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) 
    {
        this.AssignSource(creep);
	    if(creep.carry.energy < creep.carryCapacity) 
	    {
            var source = Game.getObjectById(creep.memory.assignedSource);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) 
            {
                creep.moveTo(source);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
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
                var targets = creep.room.find(FIND_STRUCTURES, {
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
	        var room =  Game.rooms[newcreep.memory.spawnroom];
	        var sources = room.find(FIND_SOURCES);
	        
	        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	        for (var s in sources) 
	        {
	            var assignedMiners = 0;
	            for (var h in harvesters) 
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
