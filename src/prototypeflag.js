Flag.prototype.run = function()
{

    if (this.memory.mineroom == true)
    {
        this.PrepareMining();
    }

    if (this.memory.claimroom == true)
    {

    }
};


Flag.prototype.PrepareMining = function(room)
{
    if (Memory.remoteminingtargets == undefined)
    {
        Memory.remoteminingtargets = {};
    }

    Memory.remoteminingtargets = (this.pos);
};