let roles = {
    harvester: require('./role.harvester'),
    upgrader: require('./role.upgrader'),
    builder: require('./role.builder'),
    centrydrone: require('./role.sentrydrone')
};

Creep.prototype.runRole =
    function ()
    {
        roles[this.memory.role].run(this);
    };


Creep.prototype.getEnergy =
    function ()
    {
        let targets = this.room.find(FIND_STRUCTURES,
            {
                filter: (structure) =>
                {
                    return structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > 200 ;
                }
            });
        if (targets.length > 0)
        {
            this.say('Picking up');
            if(this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                this.moveTo(targets[0]);
            }
        }
        else
        {
            let closestSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if(this.harvest(closestSource) == ERR_NOT_IN_RANGE)
            {
                this.say('harvesting');
                this.moveTo(closestSource);
            }
        }
    };