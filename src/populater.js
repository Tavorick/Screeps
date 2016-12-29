let populater =
{
    
    run: function()
    {
        for(let i in Memory.creeps)
        {
             if(!Game.creeps[i])
             {
                 delete Memory.creeps[i];
             }
        }
        const rooms = Game.rooms;
        for (let roomname in rooms)
        {
            let room = rooms[roomname];
            let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            let builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
            let repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
            let centryDrones = _.filter(Game.creeps, (creep) => creep.memory.role == 'centrydrone');
            let requiredharvesters = 0;
            let requiredsentrydrones = 2;
            let requiredupgraders = 4;
            let requiredbuilders = 3;
            let requiredrepairers = 0;

            let hostiles = room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length) 
            {
                requiredsentrydrones = 4;
                requiredupgraders = 1;
                requiredbuilders = 1;
            }
            requiredharvesters += room.find(FIND_SOURCES).length;
            let role = "";
            if(harvesters.length < requiredharvesters * 2 &&  requiredsentrydrones < 4)
            {
                role = 'harvester';
            }
            
            if (centryDrones.length < requiredsentrydrones)
            {
                role = 'sentrydrone';
            }
           
            if(upgraders.length < 3) 
            {
                role = 'upgrader';
            }
               
            if(builders.length < 2) 
            {
                role = 'builder';
            }
                  
            if(repairers.length < 2)
            {
                //this.CreateCreep('repairer', roomname);
            }
            this.CreateCreep(role,room);
        }
    },
    
   CreateCreep:function(role, room)
   {
       let newcreep = Game.spawns['Home'].createCreep(this.GetBodyParts(room, role), undefined, {role: role, spawnroom: room.name});

       if (newcreep =! '-6')
       {
           console.log('Spawning new ' + role + ': ' + newcreep);
       }
   },
   
   GetBodyParts:function(room, role)
    {
        let body = [WORK,CARRY,MOVE];
        let energycost = 300;
        let desiredpart = '';
        let energyCapasity = room.energyAvailable;
        let partcost = 100;
        switch (role) 
        {
            case 'transporter':
                desiredpart = 'CARRY';
                break;
                
            case 'centrydrone':
                desiredpart = 'attack';
                partcost = 70;
                body = [MOVE, MOVE, TOUGH, ATTACK];
                energycost = 290;
                break;
            
            default:
                desiredpart = 'work';
        }
       while(energycost <= energyCapasity)
       {
           energycost += partcost;
           body.push(desiredpart);
       }
        return body;
    } 
};

module.exports = populater;
