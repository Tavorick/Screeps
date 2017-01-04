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
    Game.memory.remoteminingtargets.push(this.pos);
};