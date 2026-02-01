from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import os
import json
from grid_client import GridClient
from ai_analyzer import AIAnalyzer
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Cloud9 Assistant Coach API")
grid = GridClient()
ai_analyzer = AIAnalyzer()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for GRID data - separated by game
# Structure: { 'lol': { 'players': {}, 'team': [] }, 'valorant': { 'players': {}, 'team': [] } }
game_data_cache = {
    'lol': {
        'players': {},
        'team': [],
        'title_id': 3
    },
    'valorant': {
        'players': {},
        'team': [],
        'title_id': 21
    }
}

# Legacy cache for backward compatibility
player_stats_cache = {}
team_stats_cache = []

class PlayerStat(BaseModel):
    player_name: str
    match_id: str
    kda: float
    cs_per_min: float
    vision_score: float
    damage_dealt: int

class MacroInsight(BaseModel):
    match_id: str
    summary: str
    strategic_impact: str
    recommendations: List[str]

@app.get("/")
async def root():
    return {"message": "Cloud9 Assistant Coach API is running"}

@app.get("/players")
async def get_players():
    # In a real scenario, we might fetch players from a specific team
    # For now, return Cloud9 roster as example or fetch from GRID
    return ["Blaber", "Berserker", "Jojopyun", "Fudge", "Vulcan"]

@app.get("/player/{player_name}/stats")
async def get_player_stats(player_name: str):
    """Get player statistics from GRID data cache"""
    if player_name not in player_stats_cache:
        # Return empty for now - data will be populated from GRID series analysis
        return []
    
    return player_stats_cache[player_name]

@app.get("/player/{player_name}/analysis")
async def get_player_analysis(player_name: str):
    """Get AI-powered analysis of player performance"""
    if player_name not in player_stats_cache or not player_stats_cache[player_name]:
        raise HTTPException(
            status_code=404, 
            detail=f"No data available for {player_name}. Please analyze some GRID series first."
        )
    
    stats = player_stats_cache[player_name]
    analysis = ai_analyzer.analyze_player_performance(player_name, stats)
    
    return analysis

@app.get("/series/recent")
async def get_recent_series(title_id: int = 3):
    try:
        data = await grid.get_recent_series(title_id)
        if "data" in data and data["data"] and "allSeries" in data["data"]:
            return data["data"]["allSeries"]["edges"]
        raise HTTPException(status_code=500, detail="Invalid response format from GRID API")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent series from GRID API: {str(e)}")

@app.get("/series/recent/{game}")
async def get_recent_series_by_game(game: str, limit: int = 10):
    """
    Get recent series for a specific game (lol/league or valorant)
    
    Parameters:
    - game: Game identifier ('lol', 'league', or 'valorant')
    - limit: Number of series to fetch (default: 10)
    """
    game = game.lower()
    
    # Normalize 'league' to 'lol' for consistency
    if game == 'league':
        game = 'lol'
    
    if game not in game_data_cache:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid game '{game}'. Must be 'lol', 'league', or 'valorant'"
        )
    
    try:
        title_id = game_data_cache[game]['title_id']
        data = await grid.get_recent_series(title_id)
        
        if "data" in data and data["data"] and "allSeries" in data["data"]:
            edges = data["data"]["allSeries"]["edges"]
            # Limit results
            limited_edges = edges[:limit] if len(edges) > limit else edges
            
            return {
                "game": game,
                "title_id": title_id,
                "series_count": len(limited_edges),
                "series": limited_edges
            }
        raise HTTPException(status_code=500, detail="Invalid response format from GRID API")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching recent series for {game}: {str(e)}")

@app.get("/series/multi-game")
async def get_multi_game_series(title_ids: str = "3,21", limit: int = 10):
    """
    Fetch recent series from multiple games simultaneously.
    
    Parameters:
    - title_ids: Comma-separated list of title IDs (e.g., "3,21,4" for LoL, VALORANT, Dota2)
    - limit: Number of series to fetch per game (default: 10)
    
    Common Title IDs:
    - 3: League of Legends
    - 4: Dota 2
    - 5: CS:GO
    - 21: VALORANT
    - 23: Rainbow Six Siege
    """
    try:
        # Parse title_ids from comma-separated string
        title_id_list = [int(tid.strip()) for tid in title_ids.split(",")]
        
        if not title_id_list:
            raise HTTPException(status_code=400, detail="At least one title_id must be provided")
        
        if len(title_id_list) > 10:
            raise HTTPException(status_code=400, detail="Maximum 10 games can be fetched at once")
        
        # Fetch data from multiple games
        results = await grid.get_multiple_games_series(title_id_list, limit)
        
        # Process results
        response = {
            "total_games": len(results),
            "games": []
        }
        
        for result in results:
            game_info = {
                "title_id": result["title_id"],
                "success": result["error"] is None,
                "error": result["error"],
                "series_count": 0,
                "series": []
            }
            
            if result["data"] and "data" in result["data"]:
                series_data = result["data"]["data"].get("allSeries", {})
                edges = series_data.get("edges", [])
                game_info["series_count"] = len(edges)
                game_info["series"] = edges
                
                # Extract game name from first series if available
                if edges and edges[0].get("node", {}).get("title"):
                    game_info["game_name"] = edges[0]["node"]["title"].get("name", "Unknown")
            
            response["games"].append(game_info)
        
        return response
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid title_ids format. Use comma-separated integers (e.g., '3,21,4')")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching multi-game data: {str(e)}")

@app.get("/series/{series_id}/insights")
async def get_series_insights(series_id: str):
    """Get comprehensive insights for a series using GRID GraphQL"""
    try:
        # Try GraphQL first (more accessible than File Download)
        grid_data = await grid.get_series_details_graphql(series_id)
        
        # Process GraphQL response
        processed_insights = process_grid_graphql_data(grid_data, series_id)
        
        return processed_insights
        
    except Exception as e:
        error_msg = str(e)
        
        # Try File Download as fallback
        try:
            file_data = await grid.get_series_end_state(series_id)
            return process_grid_end_state(file_data, series_id)
        except Exception as file_error:
            # If both methods fail, raise appropriate HTTP exception
            if "403" in error_msg or "forbidden" in error_msg.lower():
                raise HTTPException(
                    status_code=403,
                    detail=f"GRID API Access Limited for series {series_id}. Verify your GRID API key has proper permissions in the GRID portal."
                )
            elif "404" in error_msg:
                raise HTTPException(
                    status_code=404,
                    detail=f"Series {series_id} not found in GRID database. Verify the series ID is correct or try a different series."
                )
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error accessing GRID data: {error_msg}"
                )

@app.get("/team/macro-analysis")
async def get_team_macro_analysis():
    """Get comprehensive team macro strategy analysis"""
    if not team_stats_cache:
        raise HTTPException(
            status_code=404, 
            detail="No team data available. Please analyze some GRID series first."
        )
    
    # Flatten all player stats from cache
    all_player_stats = []
    for player_name, stats in player_stats_cache.items():
        all_player_stats.extend(stats)
    
    analysis = ai_analyzer.analyze_team_macro(team_stats_cache, all_player_stats)
    
    return analysis

@app.get("/matches/recent")
async def get_recent_matches(limit: int = 10):
    """Get recent match data with team performance"""
    if not team_stats_cache:
        return []
    
    return team_stats_cache[-limit:] if len(team_stats_cache) > limit else team_stats_cache

@app.get("/dashboard/{game}")
async def get_game_dashboard(game: str):
    """
    Get dashboard data for a specific game (lol/league or valorant)
    Returns team stats, player stats, and recent matches for the selected game
    """
    game = game.lower()
    
    # Normalize 'league' to 'lol' for consistency
    if game == 'league':
        game = 'lol'
    
    if game not in game_data_cache:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid game '{game}'. Must be 'lol', 'league', or 'valorant'"
        )
    
    game_cache = game_data_cache[game]
    
    # Calculate aggregate statistics from cached data
    dashboard_data = {
        "game": game,
        "title_id": game_cache['title_id'],
        "stats": {
            "win_rate": 0,
            "avg_kda": 0,
            "first_blood_rate": 0,
            "clutch_rate": 0,
            "total_matches": len(game_cache['team'])
        },
        "players": [],
        "recent_matches": game_cache['team'][-10:] if game_cache['team'] else [],
        "insights": []
    }
    
    # Calculate stats if we have data
    if game_cache['team']:
        total_wins = sum(1 for match in game_cache['team'] if match.get('win', False))
        dashboard_data['stats']['win_rate'] = round((total_wins / len(game_cache['team'])) * 100, 1)
        
        # Calculate average KDA from player stats
        all_kdas = []
        for player_name, player_matches in game_cache['players'].items():
            for match in player_matches:
                if 'kda' in match:
                    all_kdas.append(match['kda'])
        
        if all_kdas:
            dashboard_data['stats']['avg_kda'] = round(sum(all_kdas) / len(all_kdas), 2)
    
    # Get player list with basic stats
    for player_name, player_matches in game_cache['players'].items():
        if player_matches:
            avg_kda = sum(m.get('kda', 0) for m in player_matches) / len(player_matches)
            dashboard_data['players'].append({
                "name": player_name,
                "matches_played": len(player_matches),
                "avg_kda": round(avg_kda, 2)
            })
    
    return dashboard_data

@app.post("/dashboard/{game}/update")
async def update_game_dashboard(game: str, series_id: str):
    """
    Fetch and cache data for a specific game from GRID API
    This endpoint fetches series data and updates the game-specific cache
    """
    game = game.lower()
    
    # Normalize 'league' to 'lol' for consistency
    if game == 'league':
        game = 'lol'
    
    if game not in game_data_cache:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid game '{game}'. Must be 'lol', 'league', or 'valorant'"
        )
    
    try:
        # Fetch series data from GRID
        title_id = game_data_cache[game]['title_id']
        series_data = await grid.get_recent_series(title_id)
        
        # Process and cache the data
        # This is a simplified version - in production, you'd parse the full series data
        if "data" in series_data and series_data["data"] and "allSeries" in series_data["data"]:
            edges = series_data["data"]["allSeries"]["edges"]
            
            # Store in game-specific cache
            for edge in edges[:5]:  # Limit to 5 most recent
                node = edge.get("node", {})
                match_data = {
                    "match_id": node.get("id", "unknown"),
                    "tournament": node.get("tournament", {}).get("name", "Unknown"),
                    "win": True,  # Placeholder - would need actual match result
                }
                game_data_cache[game]['team'].append(match_data)
            
            return {
                "success": True,
                "game": game,
                "matches_added": len(edges[:5]),
                "message": f"Successfully updated {game.upper()} dashboard data"
            }
        else:
            raise HTTPException(status_code=500, detail="Invalid response from GRID API")
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error updating {game} dashboard: {str(e)}"
        )

def process_grid_graphql_data(response: Dict[str, Any], series_id: str) -> MacroInsight:
    """Process GRID GraphQL response for series details"""
    try:
        series = response.get("data", {}).get("series", {})
        
        if not series:
            raise ValueError("No series data found")
        
        tournament_name = series.get("tournament", {}).get("name", "Unknown Tournament")
        series_name = series.get("name", "Unknown Series")
        teams = series.get("teams", [])
        team_names = [t.get("name", "Unknown") for t in teams]
        
        # Since we can't get detailed game stats with basic permissions,
        # provide strategic guidance based on series metadata
        summary = f"Series data retrieved: {series_name} in {tournament_name}"
        if team_names:
            summary += f". Teams: {', '.join(team_names[:2])}"
        
        strategic_impact = (
            "GRID GraphQL API successfully connected. However, detailed player statistics "
            "and game-by-game data require either File Download API access or extended GraphQL permissions. "
            "This demonstrates the integration is working - full analytics available with upgraded access."
        )
        
        recommendations = [
            "✅ GRID API connection verified and working",
            "✅ Series metadata retrieved successfully",
            "📊 For player stats & game analysis: Upgrade to GRID File Download API",
            "🔧 Or: Contact GRID support for extended GraphQL permissions",
            "💡 Alternative: The app can analyze data from GRID-provided sample files"
        ]
        
        return MacroInsight(
            match_id=series_id,
            summary=summary,
            strategic_impact=strategic_impact,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise ValueError(f"Error processing GraphQL data: {str(e)}")

def process_grid_end_state(data: Dict[str, Any], series_id: str) -> MacroInsight:
    """Process GRID end-state JSON data for insights"""
    try:
        insights = {
            "summary": "",
            "strategic_impact": "",
            "recommendations": []
        }
        
        # Parse GRID data structure
        if "games" in data and len(data["games"]) > 0:
            games = data["games"]
            
            # Aggregate stats across games
            total_kills = 0
            total_deaths = 0
            total_assists = 0
            total_dragons = 0
            total_barons = 0
            total_towers = 0
            wins = 0
            game_durations = []
            first_bloods = 0
            
            # Player-specific aggregation for micro-to-macro connection
            player_performances = {}
            
            for game_idx, game in enumerate(games):
                game_duration = game.get("gameDuration", 1800) / 60  # Convert to minutes
                game_durations.append(game_duration)
                
                # Extract team stats
                if "teams" in game:
                    for team in game["teams"]:
                        team_name = team.get("name", "")
                        
                        # Identify if this is Cloud9 or relevant team
                        is_target_team = "cloud9" in team_name.lower() or "c9" in team_name.lower()
                        
                        if "stats" in team:
                            stats = team["stats"]
                            kills = stats.get("kills", 0)
                            deaths = stats.get("deaths", 0)
                            
                            total_kills += kills
                            total_deaths += deaths
                            total_dragons += stats.get("dragons", 0)
                            total_barons += stats.get("barons", 0)
                            total_towers += stats.get("towers", 0)
                            
                            if stats.get("win", False):
                                wins += 1
                            if stats.get("firstBlood", False):
                                first_bloods += 1
                        
                        # Extract player data for micro analysis
                        if "players" in team:
                            for player in team["players"]:
                                player_name = player.get("summonerName", player.get("name", "Unknown"))
                                role = player.get("role", "Unknown")
                                
                                if player_name not in player_performances:
                                    player_performances[player_name] = []
                                
                                player_stats = player.get("stats", {})
                                player_performances[player_name].append({
                                    "match_id": f"{series_id}_game{game_idx+1}",
                                    "game_number": game_idx + 1,
                                    "player_name": player_name,
                                    "role": role,
                                    "champion": player.get("championName", "Unknown"),
                                    "kills": player_stats.get("kills", 0),
                                    "deaths": player_stats.get("deaths", 0),
                                    "assists": player_stats.get("assists", 0),
                                    "kda": calculate_kda(
                                        player_stats.get("kills", 0),
                                        player_stats.get("deaths", 0),
                                        player_stats.get("assists", 0)
                                    ),
                                    "cs_per_min": player_stats.get("totalMinionsKilled", 0) / game_duration if game_duration > 0 else 0,
                                    "vision_score": player_stats.get("visionScore", 0),
                                    "damage_dealt": player_stats.get("totalDamageDealtToChampions", 0),
                                    "gold_earned": player_stats.get("goldEarned", 0),
                                    "performance_score": calculate_performance_score(player_stats, game_duration)
                                })
            
            # Cache player data for micro analysis
            for player_name, stats in player_performances.items():
                if player_name not in player_stats_cache:
                    player_stats_cache[player_name] = []
                player_stats_cache[player_name].extend(stats)
                # Keep only last 50 games per player
                player_stats_cache[player_name] = player_stats_cache[player_name][-50:]
            
            # Calculate metrics
            num_games = len(games)
            avg_kda = (total_kills + total_assists) / total_deaths if total_deaths > 0 else total_kills + total_assists
            win_rate = wins / num_games if num_games > 0 else 0
            avg_game_duration = sum(game_durations) / len(game_durations) if game_durations else 30
            
            # Cache team-level stats
            team_stat = {
                "match_id": series_id,
                "win": win_rate > 0.5,
                "dragons_secured": total_dragons / num_games,
                "barons_secured": total_barons / num_games,
                "towers_destroyed": total_towers / num_games,
                "first_blood": first_bloods > 0,
                "avg_game_duration": avg_game_duration,
                "win_rate": win_rate
            }
            team_stats_cache.append(team_stat)
            # Keep only last 50 matches
            if len(team_stats_cache) > 50:
                team_stats_cache.pop(0)
            
            # Generate comprehensive insights
            if win_rate >= 0.6:
                insights["summary"] = f"Dominant series performance with {wins}/{num_games} games won. Team showed strong execution across all phases."
            elif win_rate >= 0.4:
                insights["summary"] = f"Competitive series with {wins}/{num_games} games won. Close matches indicate even skill levels."
            else:
                insights["summary"] = f"Challenging series with {wins}/{num_games} games won. Team struggled with execution and strategy."
            
            # Macro analysis
            if total_dragons / num_games >= 2.5:
                insights["strategic_impact"] = "Excellent dragon control provided scaling advantage and map pressure. Jungler and bot lane showed strong objective prioritization."
            elif total_dragons / num_games >= 1.5:
                insights["strategic_impact"] = "Moderate dragon control. Some missed opportunities around neutral objectives. Bot lane priority needs improvement."
            else:
                insights["strategic_impact"] = "Poor objective control significantly impacted win conditions. Critical weakness in jungle pathing and bot lane pressure."
            
            # Deep recommendations based on data
            if avg_kda < 2.5:
                insights["recommendations"].append("Critical: Team KDA below 2.5. Focus on reducing deaths through better vision control and map awareness.")
            
            if total_dragons / num_games < 2:
                insights["recommendations"].append("Dragon priority: Average {:.1f} dragons per game is below optimal. Coordinate jungle/bot rotations 60 seconds before spawn.".format(total_dragons / num_games))
            
            if total_barons / num_games < 0.3 and num_games > 2:
                insights["recommendations"].append("Late game: Low baron control suggests weak mid-to-late game transitions. Practice baron setups and vision denial.")
            
            if avg_game_duration > 35:
                insights["recommendations"].append("Game tempo: Long average game time ({:.1f} min) indicates indecisive mid-game. Work on proactive plays and objective forcing.".format(avg_game_duration))
            elif avg_game_duration < 25:
                insights["recommendations"].append("Early aggression: Fast game pace ({:.1f} min) shows strong early game. Maintain momentum while avoiding overaggression.".format(avg_game_duration))
            
            if not insights["recommendations"]:
                insights["recommendations"].append("Execution is solid. Continue current practice regimen and maintain focus on fundamentals.")
        
        else:
            # Minimal data available
            insights["summary"] = f"Series {series_id} data retrieved from GRID API."
            insights["strategic_impact"] = "Limited detailed statistics available for comprehensive analysis."
            insights["recommendations"] = ["Review full match VODs for qualitative analysis", "Check GRID data format and permissions"]
        
        return MacroInsight(
            match_id=series_id,
            summary=insights["summary"],
            strategic_impact=insights["strategic_impact"],
            recommendations=insights["recommendations"]
        )
        
    except Exception as e:
        # Error in processing - raise exception to be handled by caller
        raise ValueError(f"Error processing GRID data: {str(e)}")

@app.post("/assistant/personalized-insights")
async def get_personalized_insights(request: Dict[str, Any]):
    """
    Main Prompt 1: Generate personalized player insights with data-backed feedback
    
    Example request body:
    {
        "player_name": "OXY",
        "match_data": {...},  # Complete match data
        "game": "valorant"  # or "lol"
    }
    """
    try:
        player_name = request.get("player_name")
        match_data = request.get("match_data", {})
        game = request.get("game", "lol")
        
        if not player_name:
            raise HTTPException(status_code=400, detail="player_name is required")
        
        if not match_data:
            raise HTTPException(status_code=400, detail="match_data is required")
        
        insights = ai_analyzer.generate_personalized_insights(player_name, match_data, game)
        return insights
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")

@app.post("/assistant/macro-review")
async def generate_macro_review(request: Dict[str, Any]):
    """
    Main Prompt 2: Generate automated Game Review Agenda
    
    Example request body:
    {
        "match_data": {...},  # Complete match data from concluded match
        "game": "valorant"  # or "lol"
    }
    """
    try:
        match_data = request.get("match_data", {})
        game = request.get("game", "lol")
        
        if not match_data:
            raise HTTPException(status_code=400, detail="match_data is required")
        
        review = ai_analyzer.generate_macro_review_agenda(match_data, game)
        return review
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating review: {str(e)}")

@app.post("/assistant/predict-scenario")
async def predict_hypothetical_scenario(request: Dict[str, Any]):
    """
    Main Prompt 3: Predict hypothetical 'what if' scenario outcomes
    
    Example request body (VALORANT):
    {
        "game": "valorant",
        "scenario": {
            "question": "On Round 22 (score 10-11) on Haven, we attempted a 3v5 retake on C-site and lost. Would it have been better to save?",
            "round": 22,
            "score": "10-11",
            "situation": "3v5 retake",
            "site": "C",
            "time": "15s",
            "weapons": "3 rifles",
            "enemy_utility": "full"
        }
    }
    
    Example request body (LoL):
    {
        "game": "lol",
        "scenario": {
            "question": "C9 contested Drake at 24:15 and everybody died. Would it have been better to not contest?",
            "timestamp": "24:15",
            "gold_diff": -2500,
            "level_diff": -1.5,
            "vision": "poor",
            "soul_point": false,
            "other_objectives": ["mid T2", "bot T2"]
        }
    }
    """
    try:
        game = request.get("game", "lol")
        scenario = request.get("scenario", {})
        
        if not scenario:
            raise HTTPException(status_code=400, detail="scenario is required")
        
        prediction = ai_analyzer.predict_hypothetical_outcome(scenario, game)
        return prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting scenario: {str(e)}")

def calculate_kda(kills: int, deaths: int, assists: int) -> float:
    """Calculate KDA ratio"""
    if deaths == 0:
        return float(kills + assists)
    return round((kills + assists) / deaths, 2)

def calculate_performance_score(stats: Dict, game_duration: float) -> float:
    """Calculate overall performance score 0-100"""
    kills = stats.get("kills", 0)
    deaths = stats.get("deaths", 1)
    assists = stats.get("assists", 0)
    damage = stats.get("totalDamageDealtToChampions", 0)
    cs = stats.get("totalMinionsKilled", 0)
    vision = stats.get("visionScore", 0)
    
    # Weighted scoring
    kda_score = min((kills + assists) / deaths * 10, 40) if deaths > 0 else 40
    damage_score = min(damage / 500, 30)
    cs_score = min((cs / game_duration) * 2, 20) if game_duration > 0 else 0
    vision_score = min(vision / 3, 10)
    
    total = kda_score + damage_score + cs_score + vision_score
    return round(min(total, 100), 1)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
