import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GRID_API_KEY = os.getenv("GRID_API_KEY")
GRID_CENTRAL_DATA_URL = os.getenv("GRID_CENTRAL_DATA_URL", "https://api.grid.gg/central-data/graphql")
GRID_FILE_DOWNLOAD_URL = os.getenv("GRID_FILE_DOWNLOAD_URL", "https://api.grid.gg/file-download/end-state/grid/series/")

class GridClient:
    def __init__(self):
        self.headers = {
            "x-api-key": GRID_API_KEY,
            "Content-Type": "application/json"
        }

    async def get_recent_series(self, title_id: int = 3): # Default to LoL (3)
        query = """
        query GetRecentSeries($titleId: ID!) {
          allSeries(
            first: 10,
            filter: {
              titleId: $titleId
              types: ESPORTS
            }
            orderBy: StartTimeScheduled
            orderDirection: DESC
          ) {
            edges {
              node {
                id
                tournament {
                  name
                }
              }
            }
          }
        }
        """
        variables = {"titleId": str(title_id)}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                GRID_CENTRAL_DATA_URL,
                json={"query": query, "variables": variables},
                headers=self.headers
            )
            if response.status_code == 403:
                 raise Exception("403 Forbidden: GRID API key lacks 'Central Data' permissions")
            response.raise_for_status()
            data = response.json()
            if "errors" in data:
                error_msgs = [err.get("message", "Unknown error") for err in data["errors"]]
                if any("forbidden" in msg.lower() or "permission" in msg.lower() for msg in error_msgs):
                     raise Exception(f"403 Forbidden: GRID API permissions error - {error_msgs[0]}")
            return data

    async def get_series_details_graphql(self, series_id: str):
        """Fetch series details via GraphQL - simplified query"""
        query = """
        query GetSeriesDetails($seriesId: ID!) {
          series(id: $seriesId) {
            id
            name
            tournament {
              name
            }
            teams {
              name
            }
          }
        }
        """
        variables = {"seriesId": str(series_id)}
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                GRID_CENTRAL_DATA_URL,
                json={"query": query, "variables": variables},
                headers=self.headers
            )
            
            if response.status_code != 200:
                raise Exception(f"GraphQL request failed with status {response.status_code}: {response.text}")
            
            data = response.json()
            
            if "errors" in data:
                error_details = data['errors'][0] if data['errors'] else {}
                raise Exception(f"GraphQL Error: {error_details.get('message', 'Unknown error')}")
            
            return data

    async def get_series_end_state(self, series_id: str):
        url = f"{GRID_FILE_DOWNLOAD_URL}{series_id}"
        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=self.headers
            )
            if response.status_code == 403:
                raise Exception(f"403 Forbidden: GRID API key lacks 'File Download' permissions for series {series_id}")
            response.raise_for_status()
            return response.json()

    async def get_multiple_games_series(self, title_ids: list[int], limit_per_game: int = 10):
        """Fetch recent series from multiple games simultaneously"""
        import asyncio
        
        async def fetch_game_series(title_id: int):
            try:
                query = """
                query GetRecentSeries($titleId: ID!, $limit: Int!) {
                  allSeries(
                    first: $limit,
                    filter: {
                      titleId: $titleId
                      types: ESPORTS
                    }
                    orderBy: StartTimeScheduled
                    orderDirection: DESC
                  ) {
                    edges {
                      node {
                        id
                        title {
                          id
                          name
                        }
                        tournament {
                          name
                        }
                      }
                    }
                  }
                }
                """
                variables = {"titleId": str(title_id), "limit": limit_per_game}
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        GRID_CENTRAL_DATA_URL,
                        json={"query": query, "variables": variables},
                        headers=self.headers
                    )
                    if response.status_code == 403:
                        return {"title_id": title_id, "error": "403 Forbidden", "data": None}
                    response.raise_for_status()
                    data = response.json()
                    if "errors" in data:
                        return {"title_id": title_id, "error": data["errors"][0].get("message"), "data": None}
                    return {"title_id": title_id, "error": None, "data": data}
            except Exception as e:
                return {"title_id": title_id, "error": str(e), "data": None}
        
        # Fetch all games concurrently
        tasks = [fetch_game_series(title_id) for title_id in title_ids]
        results = await asyncio.gather(*tasks)
        
        return results
