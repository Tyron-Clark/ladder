import { fetchPlayerInfo } from "../services/playerInfoService.js";
import { fetchPlayerSpecializations } from "../services/playerSpecializationService.js";

export const processLeaderboardData = async (data, queryParams) => {
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 100;
  const search = queryParams.search || "";
  const bracket = queryParams.bracket || "2v2";
  const region = queryParams.region || "us";
  const season = queryParams.season || 11;

  let entries = data.entries || [];
  const totalEntries = entries.length;
  const totalPages = Math.ceil(totalEntries / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // First paginate the entries
  const paginatedEntries = entries.slice(startIndex, endIndex);

  // Then fetch player info only for the paginated entries
  const enrichedEntries = await Promise.all(
    paginatedEntries.map(async (entry) => {
      try {
        const playerInfo = await fetchPlayerInfo({
          region: region,
          realm: entry.character.realm.slug,
          characterName: entry.character.name,
        });

        const playerSpecialization = await fetchPlayerSpecializations({
          region: region,
          realm: entry.character.realm.slug,
          characterName: entry.character.name,
        });

        return {
          ...entry,
          character: {
            ...entry.character,
            class: playerInfo.character_class.name,
            race: playerInfo.race.name,
            specializations: playerSpecialization || [],
          },
          links: {
            equipment: playerInfo.equipment.href,
            media: playerInfo.media.href,
          },
        };
      } catch (error) {
        console.error(
          `Error fetching player info for ${entry.character.name}:`,
          error
        );
        return entry;
      }
    })
  );

  return {
    entries: enrichedEntries,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalEntries: totalEntries,
      entriesPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      searchTerm: search || null,
      bracket: bracket,
      region: region,
      season: season,
      dataSource: "blizzard-api",
    },
  };
};
