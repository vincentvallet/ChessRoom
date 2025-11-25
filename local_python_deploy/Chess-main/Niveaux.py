from pandas import DataFrame
from Criteres import *
from math import *



TabS1=[]
TabS2=[]





def AppariementNiveau(Liste_Indices,Liste_Joueurs_Ronde,Liste_niveaux,niveau,Liste_Flotteurs,Mrencontres,Mcouleurs,Mflotteurs,Mscores,Liste_remove,Liste_Finale,Nronde,Nrondemax,Liste_Players,change,ListLimbes):
    Limbes=list(ListLimbes['NA'])
    Liste_Joueurs_Niveau=DataFrame(columns=['NA','Points'])
    if change==0:
        Liste_Joueurs_Niveau['NA']=Liste_Joueurs_Ronde.loc[:, 'NA'][Liste_Indices[niveau]:Liste_Indices[niveau+1]]
        Liste_Joueurs_Niveau['Points']=Liste_Joueurs_Ronde.loc[:, 'Points'][Liste_Indices[niveau]:Liste_Indices[niveau+1]]
        Liste_Joueurs_Niveau.index = Liste_Joueurs_Niveau.index - Liste_Indices[niveau]

        for i in range(len(Liste_Joueurs_Niveau)):
            if int(Liste_Joueurs_Niveau['NA'][i]) in Liste_remove:
                Liste_Joueurs_Niveau.drop(index=i,inplace=True)

        if len(Limbes)>0 and niveau>ListLimbes['niveau'][0]:

            Liste_Joueurs_Niveau=ListLimbes['NA','Pts']._append(Liste_Joueurs_Niveau, ignore_index=True)
            Limbes=[]

        if len(Liste_Flotteurs)>0:
                Liste_Joueurs_Niveau=Liste_Flotteurs._append(Liste_Joueurs_Niveau, ignore_index=True)
        if len(Liste_Players)>0:
                Liste_Joueurs_Niveau=Liste_Players._append(Liste_Joueurs_Niveau, ignore_index=True)
 
        
        if niveau==len(Liste_niveaux)-1 and est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True and len(ListLimbes)==0:
            if len(Liste_Joueurs_Niveau)%2!=0:
                Exempt=DataFrame(columns=['NA','Points'])
                Exempt.loc[0]=[0,0]
                print('hey')
                print(Liste_Joueurs_Niveau)
                Liste_Joueurs_Niveau=Liste_Joueurs_Niveau._append(Exempt, ignore_index=True)
                print(Liste_Joueurs_Niveau)
        Liste_Joueurs_Niveau=Liste_Joueurs_Niveau.reset_index()

    
    if change==1: #change==1

        if len(Liste_Players)>0:
            Liste_Joueurs_Niveau=Liste_Players

        if niveau==len(Liste_niveaux)-1:
            if len(Liste_Joueurs_Niveau)%2!=0:
                Exempt=DataFrame(columns=['NA','Points'])
                Exempt.loc[0]=[0,0]
                print('hey')
                print(Liste_Joueurs_Niveau)
                Liste_Joueurs_Niveau=Liste_Joueurs_Niveau._append(Exempt, ignore_index=True)
                print(Liste_Joueurs_Niveau)


            Liste_Joueurs_Niveau=Liste_Joueurs_Niveau.reset_index()

    S=list(Liste_Joueurs_Niveau['NA'])


    Liste_Joueurs_Niveauprime=DataFrame(columns=['NA','Points'])
    if niveau<len(Liste_niveaux)-1:
        Liste_Joueurs_Niveauprime['NA']=Liste_Joueurs_Ronde.loc[:, 'NA'][Liste_Indices[niveau+1]:Liste_Indices[niveau+2]]
        Liste_Joueurs_Niveauprime['Points']=Liste_Joueurs_Ronde.loc[:, 'Points'][Liste_Indices[niveau+1]:Liste_Indices[niveau+2]]
    
    Liste_Joueurs_Niveauprime=Liste_Joueurs_Niveauprime.reset_index()

    Sprime=list(Liste_Joueurs_Niveauprime['NA'])

    
    M0=0
    for i in range(len(Liste_Joueurs_Niveau)):
        if Liste_Joueurs_Niveau['Points'][i]>Liste_niveaux[niveau]:
            M0+=1
    if M0<=len(Liste_Joueurs_Niveau)/2:
        MaxPaires = floor(len(Liste_Joueurs_Niveau)/2)
        M1 = M0
    else:
        MaxPaires = M0 + floor(len(Liste_Joueurs_Niveau)/2 - M0 -1)
        M1 = MaxPaires
    if est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True:
        N1=MaxPaires
        if N1>0:
            S1=S[0:N1]
            S2=S[N1:len(Liste_Joueurs_Niveau)]
        else:
            S1=S
            S2=[]
    else:
        N1=M1
        if N1>0:
            S1=S[0:N1]
            S2=S[N1:len(Liste_Joueurs_Niveau)]
        else:
            S1=S
            S2=[]

    print('input')
    print(niveau)
    print('change')
    print(change)
    print(Liste_niveaux)
    print(S)
    print(Sprime)
    print(S1,S2)  
    newS1,newS2,change=EvaluationNiveau(S,Sprime,S1,S2,Mcouleurs,Mrencontres,Mflotteurs,Mscores,Liste_Joueurs_Niveau,Liste_Joueurs_Ronde,Liste_Flotteurs,niveau,Liste_niveaux,Nronde,Nrondemax,change)
    global TabS1
    global TabS2
    print('sortie')
    print(newS1,newS2)
    print('change')
    print(change)


    S1=newS1.copy()
    S2=newS2.copy()
    
    if est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==False:
        for i in range(len(newS1)):
            if newS1[i] not in list(Liste_Flotteurs['NA']) and newS2[i] not in list(Liste_Flotteurs['NA']):
                S1.remove(newS1[i])
                S2.remove(newS2[i])
    
    if change==1:

        Next__Players=S+TabS1[-1]+TabS2[-1]
        if 0 in S:
            Next__Players.remove(0)
        
        Next__Flotteurs=[]
        Limbes=[]
        """
        for i in range(len(S)):
                if S[i] not in S1 and S[i] not in S2 and S[i]!=0:
                    Next__Flotteurs.append(S[i])
        print('yala')
        print(Next__Flotteurs)
        """
        List_remove=S1+S2
        """
        for i in range(len(Next__Flotteurs)):
            if Next__Flotteurs[i] in List_remove:
                List_remove.remove(Next__Flotteurs[i])
        """
        print('in change 1')
        print(S)
        print(S1,S2)
        print(Next__Players)
        print(Next__Flotteurs)
        print(List_remove)


    Next_Limbes=DataFrame(columns=['NA','Points','niveau'])
    if change==0:

        
        Next__Flotteurs=[]
        List_remove=[]
        Next__Players=[]
        
        
        if est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True:

            niveau=niveau+1
            for i in range(len(Limbes)):
                Next__Flotteurs.append(Limbes[i])
            for i in range(len(S)):
                if S[i] not in S1 and S[i] not in S2 and S[i]!=0:

                    Next__Flotteurs.append(S[i])

         
        else:
            for i in range(len(S)):
                if S[i] in S1 or S[i] in S2:
                        List_remove.append(S[i])
                if S[i] not in S1 and S[i] not in S2 and S[i] in list(Liste_Flotteurs['NA']):
                    Limbes.append(S[i])
            Next_Limbes['NA']=Limbes
            for i in range(len(Limbes)):
                for j in range(len(Liste_Finale)):
                    if Liste_Finale['NA'][j]==Limbes[i]:
                        Next_Limbes['Points'][i]=Liste_Finale['Points'][j]
                        Next_Limbes['niveau'][i]=niveau
        TabS1.append(S1)
        TabS2.append(S2)

    if change==2:

        
        Next__Flotteurs=[]
        List_remove=[]
        Next__Players=[]

        
        niveau=niveau+1
        for i in range(len(S)):
            if S[i] not in S1 and S[i] not in S2 and S[i]!=0:
               Next__Flotteurs.append(S[i])





    Tableau_Appariement_Niveau = DataFrame(columns=['NA Blancs','PtsB','NA Noirs','PtsN'])
    Next_Liste_Flotteurs=DataFrame(columns=['NA','Points'])
    Next_Liste_Flotteurs['NA']=Next__Flotteurs
    Next_Liste_Players=DataFrame(columns=['NA','Points'])
    Next_Liste_Players['NA']=Next__Players
    


    for i in range(len(Next__Flotteurs)):
        for j in range(len(Liste_Finale)):
            if Liste_Finale['NA'][j]==Next__Flotteurs[i]:
                Next_Liste_Flotteurs['Points'][i]=Liste_Finale['Points'][j]
    for i in range(len(Next__Players)):
        for j in range(len(Liste_Finale)):
            if Liste_Finale['NA'][j]==Next__Players[i]:
                Next_Liste_Players['Points'][i]=Liste_Finale['Points'][j]


    if len(S1)>0 and len(S2)>0:
        for i in range(len(S1)):
            Tableau_Appariement_Niveau.loc[i]=[int(S1[i]),score(S1[i],Liste_Finale),int(S2[i]),score(S2[i],Liste_Finale)]
    print('output')
    print(niveau)
    print(S1)
    print(S2)
    print(Next_Liste_Flotteurs)
    print(List_remove)
    print(Next_Liste_Players)
    print(Next_Limbes)   

    return Tableau_Appariement_Niveau, Next_Liste_Flotteurs, List_remove, niveau,Next_Liste_Players,change,Next_Limbes





def attributions_couleurs(Tableau_Appariement,Mcouleurs,Liste_Finale):
    if len(Liste_Finale)%2==0:
        N=len(Tableau_Appariement)
    else:
        N=len(Tableau_Appariement)-1
    for i in range(N):
        joueurS1=Tableau_Appariement['NA Blancs'][i]
        joueurS2=Tableau_Appariement['NA Noirs'][i]
        prefS1=prefcouleurs(Mcouleurs,joueurS1)
        prefS2=prefcouleurs(Mcouleurs,joueurS2)
        diffS1=diffcouleurs(Mcouleurs,joueurS1)
        diffS2=diffcouleurs(Mcouleurs,joueurS2)
        if prefS1!=prefS2:
            if prefS1==1 and prefS2==-1:
                Tableau_Appariement['NA Blancs'][i]=joueurS1
                Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                Tableau_Appariement['NA Noirs'][i]=joueurS2
                Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
            elif prefS1==-1 and prefS2==1:
                Tableau_Appariement['NA Blancs'][i]=joueurS2
                Tableau_Appariement['NA Noirs'][i]=joueurS1
                Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
        else:
            if couleurabsolue(Mcouleurs,joueurS1)==True and couleurabsolue(Mcouleurs,joueurS2)==False:
                if prefS1==1:
                    Tableau_Appariement['NA Blancs'][i]=joueurS1
                    Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                    Tableau_Appariement['NA Noirs'][i]=joueurS2
                    Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
                elif prefS1==-1:
                    Tableau_Appariement['NA Blancs'][i]=joueurS2
                    Tableau_Appariement['NA Noirs'][i]=joueurS1
                    Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                    Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
            if couleurabsolue(Mcouleurs,joueurS1)==False and couleurabsolue(Mcouleurs,joueurS2)==True:
                if prefS2==1:
                    Tableau_Appariement['NA Blancs'][i]=joueurS2
                    Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                    Tableau_Appariement['NA Noirs'][i]=joueurS1
                    Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
                elif prefS2==-1:
                    Tableau_Appariement['NA Blancs'][i]=joueurS1
                    Tableau_Appariement['NA Noirs'][i]=joueurS2
                    Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                    Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
            else:
                if abs(diffS1)>abs(diffS2):
                    if prefS1==1:
                        Tableau_Appariement['NA Blancs'][i]=joueurS1
                        Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                        Tableau_Appariement['NA Noirs'][i]=joueurS2
                        Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
                    elif prefS1==-1:
                        Tableau_Appariement['NA Blancs'][i]=joueurS2
                        Tableau_Appariement['NA Noirs'][i]=joueurS1
                        Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                        Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
                elif abs(diffS1)<abs(diffS2):
                        if prefS2==1:
                            Tableau_Appariement['NA Blancs'][i]=joueurS2
                            Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                            Tableau_Appariement['NA Noirs'][i]=joueurS1
                            Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
                        elif prefS2==-1:
                            Tableau_Appariement['NA Blancs'][i]=joueurS1
                            Tableau_Appariement['NA Noirs'][i]=joueurS2
                            Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                            Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
                else:
                    data=DataFrame(columns=('NA','Score'))
                    data['NA']=[joueurS1,joueurS2]
                    data['Score']=(score(joueurS1,Liste_Finale),score(joueurS2,Liste_Finale))
                    data=data.sort_values(by = ['Score','NA'], ascending = [False,True],ignore_index=True)
                    if data['NA'][0]==joueurS1:
                        if prefS1==1:
                            Tableau_Appariement['NA Blancs'][i]=joueurS1
                            Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                            Tableau_Appariement['NA Noirs'][i]=joueurS2
                            Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
                        elif prefS1==-1:
                            Tableau_Appariement['NA Blancs'][i]=joueurS2
                            Tableau_Appariement['NA Noirs'][i]=joueurS1
                            Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                            Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
                        elif data['NA'][0]==joueurS2:
                            if prefS2==1:
                                Tableau_Appariement['NA Blancs'][i]=joueurS2
                                Tableau_Appariement['PtsB'][i]=score(joueurS2,Liste_Finale)
                                Tableau_Appariement['NA Noirs'][i]=joueurS1
                                Tableau_Appariement['PtsN'][i]=score(joueurS1,Liste_Finale)
                            elif prefS2==-1:
                                Tableau_Appariement['NA Blancs'][i]=joueurS1
                                Tableau_Appariement['NA Noirs'][i]=joueurS2
                                Tableau_Appariement['PtsB'][i]=score(joueurS1,Liste_Finale)
                                Tableau_Appariement['PtsN'][i]=score(joueurS2,Liste_Finale)
    return Tableau_Appariement

def Appariement(Liste_Indices,Liste_Finale,Liste_Niveaux,Mrencontres,Mcouleurs,Mflotteurs,Mscores,Nronde,Nrondemax):
    global TabS1 
    global TabS2

    X=Liste_Indices.copy()
    Tableau_Appariement = DataFrame(columns=['NA Blancs','PtsB','NA Noirs','PtsN'])
    X.append(len(Liste_Finale))
    Liste_Flotteurs=DataFrame(columns=['NA','Points'])
    Liste_Players=DataFrame(columns=['NA','Points'])
    Liste_remove=[]
    Limbes=DataFrame(columns=['NA','Points','niveau'])
    niveau=0
    change=0
    while niveau<len(Liste_Niveaux):
        Tableau, Liste_Flotteurs,Liste_remove ,niveau,Liste_Players,change,Limbes= AppariementNiveau(X,Liste_Finale,Liste_Niveaux,niveau,Liste_Flotteurs,Mrencontres,Mcouleurs,Mflotteurs,Mscores,Liste_remove,Liste_Finale,Nronde,Nrondemax,Liste_Players,change,Limbes)
        if change==1:

            if len(TabS1[-1])>0:
                Tableau_Appariement=Tableau_Appariement.iloc[:-len(TabS1[-1])]
            TabS1.pop()
            TabS2.pop()
        else:
            Tableau_Appariement=Tableau_Appariement._append(Tableau, ignore_index=True)
    
    if len(Tableau_Appariement)<len(Liste_Finale)/2:
        Tableau_Appariement.loc[len(Tableau_Appariement)]=[Liste_Flotteurs['NA'][0],score(Liste_Flotteurs['NA'][0],Liste_Finale),'EXEMPT','0000']

    
    return Tableau_Appariement





    
def Affichage_Appariement(Tableau_Appariement,Liste_Numeros,Liste_Finale,Tableau,Mcouleurs):
    Tableau_Appariement=attributions_couleurs(Tableau_Appariement,Mcouleurs,Liste_Finale)
    Listnom=getPlayerName(Liste_Numeros,Tableau)
    Listelo=getPlayerElo(Liste_Numeros,Tableau)
    dT=DataFrame(columns=('PointsB','Blancs','EloB','Noirs','EloN','PointsN'))
    for i in range(0,int(len(Liste_Finale)/2)):
        dT.loc[i]=([Tableau_Appariement['PtsB'][i],Listnom[int(Tableau_Appariement['NA Blancs'][i])-1],Listelo[int(Tableau_Appariement['NA Blancs'][i])-1],Listnom[int(Tableau_Appariement['NA Noirs'][i])-1],Listelo[int(Tableau_Appariement['NA Noirs'][i])-1],Tableau_Appariement['PtsN'][i]])
    if len(dT)<len(Liste_Finale)/2:
        dT.loc[len(dT)]=[Tableau_Appariement['PtsB'][Tableau_Appariement.index[-1]], Listnom[int(Tableau_Appariement['NA Blancs'][Tableau_Appariement.index[-1]])-1],Listelo[int(Tableau_Appariement['NA Blancs'][Tableau_Appariement.index[-1]])-1],'EXEMPT','0','0']
    return dT
 