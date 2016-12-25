var roleUpgrader = 
{
    /** @param {Creep} creep **/
    run: function(creep) 
    {

         //make sure it has a state variable 
        if ((creep.memory.state =="MineResources")||(creep.memory.state =="UpgradeController"))
        {
            //if one of these are here then we know the creep has the right state so do nothing to it
        }
        else
        {//Seems to be missing a state var or simply has a different state from another role
            creep.memory.state="MineResources";//Set it to MineResources
        }

        if (creep.memory.state==="MineResources")
        {
            this.MineResources(creep);
            creep.say('Harvesting')
        }
        else if(creep.memory.state==="UpgradeController")
        {
            this.UpgradeController(creep); 
            creep.say('Upgrading')
        }
        else
        {//if your creep is not in any of these two states let your creep tell you
            creep.say("StateError");
        }

    }//end of function run
,

//////Second method 

    MineResources:function(creep)
    {
        //mine the resources
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
	        var sources = creep.room.find(FIND_SOURCES);
	        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(sources[0]);
            }
	   }

        //if creep is full of energy then swap state to upgrade the controller
       if(creep.carry.energy === creep.carryCapacity)
        {
            creep.memory.state="UpgradeController";
        }
    }//end of MineResources:function(creep){
,

////////////////////third method

    UpgradeController:function(creep)
    {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
        {
            creep.moveTo(creep.room.controller);
        }

        if(creep.carry.energy === 0)
        {
            //no more energy I guess we can swap states and get mining!
            creep.memory.state="MineResources";
        }
    }//end of UpgradeController:function(creep){
};//end of roleupgrader 



module.exports = roleUpgrader;
