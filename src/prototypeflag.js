Flag.prototype.run = function()
{
    let room = this.room;
    if (this.memory.mineroom == true)
    {
        this.PrepareMining(room);
    }

    if (this.memory.claimroom == true)
    {

    }
}


Flag.prototype.PrepareMining = function(room)
{
    let sources = room.find(FIND_SOURCES);
    // iterate over all sources
    for (let source of sources)
    {
        let containers = source.pos.findInRange(FIND_STRUCTURES, 1,
            {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            });

        if (containers.length > 0)
        {
          outerloop:
            for (i = room.pos.x - 1; i < room.pos.x + 2 ; i++)
            {
                for (t = room.pos.y - 1; t < room.pos.y + 2; t++ )
                {
                    if (room.createConstructionSite(i,t,STRUCTURE_CONTAINER) == 0)
                    {
                        break outerloop;
                    }
                }
            }
        }
    }
}