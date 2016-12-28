var roleCentryDrone = 
{
    run:function(creep)
    {
        var hostiles = Game.rooms[creep.memory.spawnroom].find(FIND_HOSTILE_CREEPS);
       
        if (hostiles.length == 0) 
        {
            this.Patrol(creep);
        }
        else
        {
            console.log(hostiles)
            this.Attack(creep, hostiles);
            creep.say('Destroy!');
        }
    },
    
    Patrol:function(creep)
    {
        //patrol
    },
    
    Attack:function(creep, hostiles)
    {
        if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE) 
        {
            creep.moveTo(hostiles[0]);
        }
    }    
};

module.exports = roleCentryDrone;