import sys
import json
import pandas as pd
import numpy as np
from Niveaux import Appariement, Affichage_Appariement

# Helper to reconstruct data structures from JSON input
def process_input(data):
    players = data['players']
    current_round = data['current_round']
    total_rounds = data['total_rounds']

    # 1. Create Liste_Finale (DataFrame with NA and Points)
    # Expected: DataFrame with columns ['NA', 'Points'], sorted by Points desc, NA asc
    df_players = pd.DataFrame(players)
    # Ensure NA is integer and Points is float/int
    df_players['NA'] = df_players['id'].astype(int)
    df_players['Points'] = df_players['score'].astype(float)
    
    # For round 1, use rating as "virtual score" for initial ranking
    # This ensures players are paired based on rating strength
    if current_round == 1:
        # Add rating column (fillna for missing values)
        if 'rating' in df_players.columns:
            df_players['Rating'] = pd.to_numeric(df_players['rating'], errors='coerce').fillna(1500).astype(int)
        else:
            df_players['Rating'] = 1500
        # Sort by Rating descending for round 1
        df_sorted = df_players.sort_values(by=['Rating', 'NA'], ascending=[False, True], ignore_index=True)
        Liste_Finale = df_sorted[['NA', 'Points']].copy()
    else:
        # Sort: Points Descending, NA Ascending
        Liste_Finale = df_players[['NA', 'Points']].sort_values(by=['Points', 'NA'], ascending=[False, True], ignore_index=True)

    # 2. Create Liste_Niveaux and Liste_Indices
    # Liste_Niveaux: Unique scores present
    # Liste_Indices: Indices in Liste_Finale where the score group starts
    Liste_Niveaux = []
    Liste_Indices = []
    
    current_score = -1
    for i in range(len(Liste_Finale)):
        score = Liste_Finale.loc[i, 'Points']
        if score != current_score:
            Liste_Niveaux.append(score)
            Liste_Indices.append(i)
            current_score = score
    
    # 3. Create Matrices (Mrencontres, Mcouleurs, Mflotteurs, Mscores)
    # Dimensions: [NumPlayers, TotalRounds] or [NumPlayers, NumPlayers]
    # Note: The original code uses 1-based indexing for players in some places, but 0-based for matrix access.
    # We need to be careful. The original code seems to map NA (1-based) to index NA-1.
    
    num_players = len(players)
    # Find max NA to size arrays correctly (in case IDs are not 1..N contiguous, though they should be)
    max_na = df_players['NA'].max()
    
    Mrencontres = np.zeros((max_na, max_na))
    Mcouleurs = np.zeros((max_na, total_rounds))
    Mscores = np.zeros((max_na, total_rounds))
    Mflotteurs = np.zeros((max_na, total_rounds)) # This might be tricky to reconstruct perfectly without full history logic
    
    # Fill matrices from history
    for p in players:
        p_idx = int(p['id']) - 1 # 0-based index for matrix
        history = p.get('history', [])
        
        current_score_sum = 0
        
        for round_data in history:
            r_idx = int(round_data['round']) - 1
            
            # Mscores
            score = float(round_data['score'])
            Mscores[p_idx, r_idx] = score
            current_score_sum += score
            
            # Mcouleurs
            color = round_data.get('color', '')
            if color == 'white':
                Mcouleurs[p_idx, r_idx] = 1
            elif color == 'black':
                Mcouleurs[p_idx, r_idx] = -1
            
            # Mrencontres
            opponent_id = round_data.get('opponent_id')
            if opponent_id is not None:
                opp_idx = int(opponent_id) - 1
                Mrencontres[p_idx, opp_idx] = 1
                Mrencontres[opp_idx, p_idx] = 1
            
            # Mflotteurs reconstruction is complex. 
            # The original code calculates it based on score differences at the time of pairing.
            # If we don't have full round-by-round history of all players, we can't easily reconstruct it.
            # However, the JS side might pass it, or we might need to approximate/ignore if not critical for *next* pairing 
            # (though it is critical for float checks).
            # For now, we will assume the JS passes enough info or we accept a limitation.
            # Actually, the original getFlotteurs calculates it from scratch. We should probably do the same if we had full history.
            # But here we only have the current state? No, 'history' in JS usually has all rounds.
            
            # Let's try to reconstruct Mflotteurs if possible, or leave 0 if too complex for this interface.
            # The Python code uses Mflotteurs to check upfloat/downfloat history.
            
            pass

    # Re-implement getFlotteurs logic if needed, but it requires knowing the score of both players AT THAT ROUND.
    # We can compute cumulative scores per round.
    
    # Compute cumulative scores for Mflotteurs
    cumulative_scores = np.cumsum(Mscores, axis=1)
    
    # Fill Mflotteurs
    for p in players:
        p_idx = int(p['id']) - 1
        history = p.get('history', [])
        for round_data in history:
            r_idx = int(round_data['round']) - 1
            opponent_id = round_data.get('opponent_id')
            
            if opponent_id is not None:
                opp_idx = int(opponent_id) - 1
                
                # Scores BEFORE this round
                score_p = 0 if r_idx == 0 else cumulative_scores[p_idx, r_idx-1]
                score_o = 0 if r_idx == 0 else cumulative_scores[opp_idx, r_idx-1]
                
                if score_p < score_o: # Upfloat for p (played higher)
                    Mflotteurs[p_idx, r_idx] = 1
                elif score_p > score_o: # Downfloat for p (played lower)
                    Mflotteurs[p_idx, r_idx] = -1
    
    return Liste_Indices, Liste_Finale, Liste_Niveaux, Mrencontres, Mcouleurs, Mflotteurs, Mscores, current_round, total_rounds

def main():
    try:
        # Read JSON from stdin or file
        if len(sys.argv) > 1:
            with open(sys.argv[1], 'r') as f:
                data = json.load(f)
        else:
            data = json.load(sys.stdin)
            
        Liste_Indices, Liste_Finale, Liste_Niveaux, Mrencontres, Mcouleurs, Mflotteurs, Mscores, Nronde, Nrondemax = process_input(data)
        
        # Call the pairing algorithm
        # Note: Appariement returns a DataFrame
        TableauAppariement = Appariement(Liste_Indices, Liste_Finale, Liste_Niveaux, Mrencontres, Mcouleurs, Mflotteurs, Mscores, Nronde, Nrondemax)
        
        # Process result to JSON
        # TableauAppariement columns: ['NA Blancs', 'PtsB', 'NA Noirs', 'PtsN']
        # We need to attribute colors first! The original code calls Affichage_Appariement which calls attributions_couleurs.
        # We should call attributions_couleurs directly or use Affichage_Appariement logic.
        
        from Niveaux import attributions_couleurs
        TableauAppariement = attributions_couleurs(TableauAppariement, Mcouleurs, Liste_Finale)
        
        pairings = []
        for index, row in TableauAppariement.iterrows():
            white_id = row['NA Blancs']
            black_id = row['NA Noirs']
            
            # Handle 'EXEMPT' (Bye)
            if white_id == 'EXEMPT':
                pairings.append({'white': None, 'black': int(black_id)})
            elif black_id == 'EXEMPT':
                pairings.append({'white': int(white_id), 'black': None})
            else:
                pairings.append({'white': int(white_id), 'black': int(black_id)})
                
        print(json.dumps({'status': 'success', 'pairings': pairings}))
        
    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({'status': 'error', 'message': str(e)}))

if __name__ == "__main__":
    main()
