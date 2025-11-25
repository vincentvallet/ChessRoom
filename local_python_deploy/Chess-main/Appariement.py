from NumeroAppariement import *
from Niveaux import *


def getPairing(url,Nronde,Nrondemax):
    Tableau = getTable(url)
    Liste_Numeros = getNumber(Tableau)
    Mscores,Mcouleurs,Mrencontres,Mflotteurs=getData(Tableau,Nronde)
    Liste_Finale=getListeFinale(Liste_Numeros,Mscores)
    Liste_Joueurs_Ronde=Liste_Finale #rajouter une liste de joueur à enlever pour la ronde
    Liste_Niveaux, Liste_Indices = getNiveaux(Liste_Joueurs_Ronde)
    TableauAppariement=Appariement(Liste_Indices,Liste_Finale,Liste_Niveaux,Mrencontres,Mcouleurs,Mflotteurs,Mscores,Nronde,Nrondemax)
    print(TableauAppariement)
    print(prefcouleurs(Mcouleurs,13))
    print(diffcouleurs(Mcouleurs,13))
    print(prefcouleurs(Mcouleurs,18))
    print(diffcouleurs(Mcouleurs,18))
    res=Affichage_Appariement(TableauAppariement,Liste_Numeros,Liste_Finale,Tableau,Mcouleurs)
    return res
    
