let tower =
    {
        run:function(tower)
        {
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure != STRUCTURE_WALL
            });

            if (closestDamagedStructure)
            {
                tower.repair(closestDamagedStructure);
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile)
            {
                tower.attack(closestHostile);
            }
        }
    }
module.exports = tower;