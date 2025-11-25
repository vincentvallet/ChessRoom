from numpy import sum


import sys
from numpy import set_printoptions
set_printoptions(threshold=sys.maxsize)


from networkx import Graph
from networkx.algorithms.matching  import max_weight_matching


from math import floor
from NumeroAppariement import *

def est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change):
    Points=list(Liste_Joueurs_Niveau['Points'])
    if change==1:
        return True
    if change==2:
        return True
    for i in range(len(Liste_Joueurs_Niveau)):
        if Points[i]>Liste_Niveaux[niveau]:
            return False
    return True
    

def complete_matching(X,S):
    if len(X)==len(S)/2:
        return True
    return False
    


def diffcouleurs(Mcouleurs,NAjoueur):
    diffcoul=sum(Mcouleurs[int(NAjoueur)-1])
    return diffcoul

def prefcouleurs(Mcouleurs,NAjoueur):
    DC=diffcouleurs(Mcouleurs,NAjoueur)
  
    if len(Mcouleurs[int(NAjoueur)-1])==0:
        return 0
    elif DC<-1 or (len(Mcouleurs[int(NAjoueur)-1])>1 and Mcouleurs[int(NAjoueur)-1][-1]==-1 and Mcouleurs[int(NAjoueur)-1][-2]==-1):
        return 1
    elif DC>1 or (len(Mcouleurs[int(NAjoueur)-1])>1 and Mcouleurs[int(NAjoueur)-1][-1]==1 and Mcouleurs[int(NAjoueur)-1][-2]==1):
        return -1
    elif DC==1:
        return -1
    elif DC==-1:
        return 1
    elif DC==0:
        for i in range(1,len(Mcouleurs[int(NAjoueur)-1])+1):
            if Mcouleurs[int(NAjoueur)-1][-i]!=0:
                return -Mcouleurs[int(NAjoueur)-1][-i]
        return 0
    
    else:

        return 0

def couleurabsolue(Mcouleurs,NAjoueur):
    if abs(diffcouleurs(Mcouleurs,NAjoueur))>1:
        return True
    if abs(diffcouleurs(Mcouleurs,NAjoueur))==0:
        return False
    if (len(Mcouleurs[int(NAjoueur)-1])>1 and Mcouleurs[int(NAjoueur)-1][-1]==-1 and Mcouleurs[int(NAjoueur)-1][-2]==-1):
        return True
    if (len(Mcouleurs[int(NAjoueur)-1])>1 and Mcouleurs[int(NAjoueur)-1][-1]==1 and Mcouleurs[int(NAjoueur)-1][-2]==1):
        return True
    return False

        




def score(NAjoueur,Liste_Finale):
    for i in range(0,len(Liste_Finale)):
        if NAjoueur==Liste_Finale['NA'][i]:
            NAscore=Liste_Finale['Points'][i]
    return NAscore

def CriteresAbs(joueuri,joueurj,Mcouleurs,Mrencontres,Nronde,Nrondemax,Liste_Finale):
    if Nronde==Nrondemax:
        if Mrencontres[int(joueuri)-1,int(joueurj)-1]!=1:
            if abs(diffcouleurs(Mcouleurs,joueuri)+diffcouleurs(Mcouleurs,joueurj))>=4:
                if (score(joueuri,Liste_Finale)>(Nrondemax-1)/2 and score(joueurj,Liste_Finale)>(Nrondemax-1)/2):
                    return True
                return False
            return True
        return False
    else:
        if abs(diffcouleurs(Mcouleurs,joueuri)+diffcouleurs(Mcouleurs,joueurj))<4 and Mrencontres[int(joueuri)-1,int(joueurj)-1]!=1:
            return True
        return False
    

       

def EvaluationNiveau(S,Sprime,S1,S2,Mcouleurs,Mrencontres,Mflotteurs,Mscores,Liste_Joueurs_Niveau,Liste_Finale,Liste_Flotteurs,niveau,Liste_niveaux,Nronde,Nrondemax,change):
    G = Graph()
    G.add_nodes_from(S)
    if niveau==len(Liste_niveaux)-1:
        for i in range(len(S)):
            for j in range(len(S)):
                if S[i]!=0 and S[j]!=0:
                    if CriteresAbs(S[i],S[j],Mcouleurs,Mrencontres,Nronde,Nrondemax,Liste_Finale)==True and i<j:
                        G.add_edge(S[i],S[j],weight=Weight(S[i],S[j],S,Sprime,S1,S2,Mcouleurs,Mscores,Mflotteurs,Liste_Joueurs_Niveau,Liste_niveaux,niveau,Liste_Finale,Liste_Flotteurs,Nronde,Nrondemax,change)) 
                if S[i]!=0 and S[j]==0 and Mrencontres[int(S[i])-1,int(S[i])-1]!=1 and i<j:
                        G.add_edge(S[i],S[j],Weight=0)  #Possible que ce soit pas bon
    else:
            for i in range(0,len(S)):
                for j in range(0,len(S)):
                    if CriteresAbs(S[i],S[j],Mcouleurs,Mrencontres,Nronde,Nrondemax,Liste_Finale)==True and i<j:
                        G.add_edge(S[i],S[j],weight=Weight(S[i],S[j],S,Sprime,S1,S2,Mcouleurs,Mscores,Mflotteurs,Liste_Joueurs_Niveau,Liste_niveaux,niveau,Liste_Finale,Liste_Flotteurs,Nronde,Nrondemax,change)) 
            G.add_nodes_from(Sprime)
            for i in range(0,len(S)):
                for j in range(0,len(Sprime)):
                    if CriteresAbs(S[i],Sprime[j],Mcouleurs,Mrencontres,Nronde,Nrondemax,Liste_Finale)==True:
                        G.add_edge(S[i],Sprime[j],weight=Weight(S[i],Sprime[j],S,Sprime,S1,S2,Mcouleurs,Mscores,Mflotteurs,Liste_Joueurs_Niveau,Liste_niveaux,niveau,Liste_Finale,Liste_Flotteurs,Nronde,Nrondemax,change))
            for i in range(0,len(Sprime)):
                for j in range(0,len(Sprime)):
                    if CriteresAbs(Sprime[i],Sprime[j],Mcouleurs,Mrencontres,Nronde,Nrondemax,Liste_Finale)==True and i<j:
                         G.add_edge(Sprime[i],Sprime[j],weight=Weight(Sprime[i],Sprime[j],S,Sprime,S1,S2,Mcouleurs,Mscores,Mflotteurs,Liste_Joueurs_Niveau,Liste_niveaux,niveau,Liste_Finale,Liste_Flotteurs,Nronde,Nrondemax,change))

    if change==0:
        X=list(max_weight_matching(G, maxcardinality=False, weight='weight'))

    else:
        X=list(max_weight_matching(G, maxcardinality=True, weight='weight'))
        print('yo')
        print(X)

    newS1=[]
    newS2=[]
    if niveau==len(Liste_niveaux)-1 and complete_matching(X,S)==False and est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True:
        change=1
        S1=newS1
        S2=newS2
    else:
        if change==1:
            change=2
        else:
            change=0
        for i in range(len(X)):
            if list(X[i])[0] in S and list(X[i])[1] in S and list(X[i])[0]!=0 and list(X[i])[1]!=0 :
                if list(X[i])[0] in S1 and list(X[i])[1] in S2:
                    newS1.append(list(X[i])[0])
                    newS2.append(list(X[i])[1])
                if list(X[i])[1] in S1 and list(X[i])[0] in S2:
                    newS1.append(list(X[i])[1])
                    newS2.append(list(X[i])[0])
                if list(X[i])[0] in S1 and list(X[i])[1] in S1: #and est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True:
                    newS1.append(min(list(X[i])[0],list(X[i])[1]))
                    newS2.append(max(list(X[i])[0],list(X[i])[1]))
                if list(X[i])[0] in S2 and list(X[i])[1] in S2: #and est_homogene(Liste_Joueurs_Niveau,Liste_niveaux,niveau,change)==True:
                    newS1.append(min(list(X[i])[0],list(X[i])[1]))
                    newS2.append(max(list(X[i])[0],list(X[i])[1]))
                

        data=DataFrame(columns=('S1','scoreS1','S2'))
        data['S1']=newS1
        for i in range(len(newS1)):
            data['scoreS1'][i]=score(data['S1'][i],Liste_Finale)
        data['S2']=newS2
        data=data.sort_values(by = ['scoreS1','S1'], ascending = [False,True],ignore_index=True)
        S1=list(data['S1'])
        S2=list(data['S2'])
    return S1,S2,change
        


def Weight(joueuri,joueurj,Si,Sprimei,S1i,S2i,Mcouleurs,Mscores,Mflotteurs,Liste_Joueurs_Niveau,Liste_Niveaux,niveau,Liste_Finale,Liste_Flotteurs,Nronde,Nrondemax,change):
    joueuri=int(joueuri)
    joueurj=int(joueurj)
    S=Si.copy()
    Sprime=Sprimei.copy()
    S1=S1i.copy()
    S2=S2i.copy()

    if len(S2)>=len(S1) and 0 in S:
        S2.insert(0,S1[-1])
        S1.remove(S1[-1])

    if 0 in S:
        S.remove(0)
    if 0 in S2:
        S2.remove(0)
    if 0 in S1:
        S1.remove(0)
    
    LW=[]
    M=(4*len(Liste_Finale))**4

    LC=[]

    
    
    #QUALITY CRITERIA C5
    if (joueuri in S and joueurj in S):
        LW.append(1)
    else:
        LW.append(0)
    LC.append('C5')
    
    
    #QUALITY CRITERIA C6
    if (joueuri in S and joueurj in S):
        if joueuri in list(Liste_Flotteurs['NA']) or joueurj in list(Liste_Flotteurs['NA']):
          LW.append(1)
        else:
            LW.append(0)
    else:
        LW.append(0)
    LC.append('C6.1')
    
    #QUALITY CRITERIA C6
    ListPoints = []
    for i in range(len(Liste_Flotteurs)):
        if Liste_Flotteurs['Points'][i] not in ListPoints:
            ListPoints.append(Liste_Flotteurs['Points'][i])
    Lw=[0]*(len(ListPoints))
    LC.append(['C6.2']*(len(ListPoints)))
    if (joueuri in S and joueurj in S):
        if joueuri in list(Liste_Flotteurs['NA']):
            k=0
            for i in range(len(Liste_Flotteurs)):
                if Liste_Flotteurs['NA'][i]==joueuri:
                    for j in range(len(ListPoints)):
                        if ListPoints[j]==Liste_Flotteurs['Points'][i]:
                            Lw[j]=1
        elif joueurj in list(Liste_Flotteurs['NA']):
            k=0
            for i in range(len(Liste_Flotteurs)):
                if Liste_Flotteurs['NA'][i]==joueurj:
                    for j in range(len(ListPoints)):
                        if ListPoints[j]==Liste_Flotteurs['Points'][i]:
                            Lw[j]=1
    for i in range(len(Lw)):
        LW.append(Lw[i]) 
    
    #QUALITY CRITERIA C7
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if (joueuri in Sprime or joueurj in Sprime):
                LW.append(1)
        else:
            LW.append(0)
    else:
        LW.append(0)


    LC.append('C7.1')
    
    #QUALITY CRITERIA C7
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if (joueuri in Sprime and joueurj in S) or (joueuri in S and joueurj in Sprime):
            LW.append(1)
        else:
            LW.append(0)
    else:
        LW.append(0)

    LC.append('C7.2')

    #QUALITY CRITERIA C8


    if (joueuri in S and joueurj in S and Nronde==Nrondemax):
        if score(joueuri,Liste_Finale)>(Nrondemax-1)/2 or score(joueurj,Liste_Finale)>(Nrondemax-1)/2:
            if diffcouleurs(Mcouleurs,joueuri)==2 and diffcouleurs(Mcouleurs,joueurj)==2:
                LW.append(-1)
            elif diffcouleurs(Mcouleurs,joueuri)==-2 and diffcouleurs(Mcouleurs,joueurj)==-2:
                LW.append(-1)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
        LW.append(0)

    LC.append('C8')

     #QUALITY CRITERIA C9

    if (joueuri in S and joueurj in S and Nronde==Nrondemax):
            if score(joueuri,Liste_Finale)>(Nrondemax-1)/2 or score(joueurj,Liste_Finale)>(Nrondemax-1)/2:
                if (len(Mcouleurs[int(joueuri)-1])>1 and Mcouleurs[joueuri-1][-1]==-1 and Mcouleurs[joueuri-1][-2]==-1 and Mcouleurs[joueurj-1][-1]==-1 and Mcouleurs[joueurj-1][-2]==-1):
                    LW.append(-1)
                elif (len(Mcouleurs[int(joueuri)-1])>1 and Mcouleurs[joueuri-1][-1]==1 and Mcouleurs[joueuri-1][-2]==1 and Mcouleurs[joueurj-1][-1]==1 and Mcouleurs[joueurj-1][-2]==1):
                     LW.append(-1)
                else:
                    LW.append(0)
            else:
                LW.append(0)
    else:
        LW.append(0)

    LC.append('C9')
    
    #QUALITY CRITERIA C10
    
    if (joueuri in S and joueurj in S):
        if prefcouleurs(Mcouleurs,joueuri)==prefcouleurs(Mcouleurs,joueurj):
            LW.append(-1)
        else:
            LW.append(0)
    else:
        LW.append(0)
    
    LC.append('C10')
    
    #QUALITY CRITERIA C11
    if (joueuri in S and joueurj in S):
        if diffcouleurs(Mcouleurs,joueuri)==diffcouleurs(Mcouleurs,joueurj) and (diffcouleurs(Mcouleurs,joueuri)==1 or diffcouleurs(Mcouleurs,joueuri)==-1):
            LW.append(-1)
        else:
            LW.append(0)
    else:
        LW.append(0)
    LC.append('C11')
    
    #QUALITY CRITERIA C12
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        p=0
        if (joueuri in S and joueurj in S):
            if len(Mflotteurs[int(joueuri)-1])>0:
                if Mflotteurs[int(joueuri)-1][-1]==-1 and joueuri in S:
                    p=p+1
                if Mflotteurs[int(joueurj)-1][-1]==-1 and joueurj in S:
                    p=p+1
                LW.append(p)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
            LW.append(0)
    LC.append('C12')

    #QUALITY CRITERIA C13
    if (joueuri in S and joueurj in S):
            if len(Mflotteurs[int(joueuri)-1])>0:
                if (joueuri in list(Liste_Flotteurs['NA']) and Mflotteurs[joueurj-1][-1]==1):
                    LW.append(-1)
                else:
                    LW.append(0)
            else:
                    LW.append(0)
    else:
            LW.append(0)

    LC.append('C13')
    

    #QUALITY CRITERIA C14
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        p=0
        if (joueuri in S and joueurj in S):
            if len(Mflotteurs[int(joueuri)-1])>1:
                if Mflotteurs[int(joueuri)-1][-2]==-1 and joueuri in S:
                    p=p+1
                if Mflotteurs[int(joueurj)-1][-2]==-1 and joueurj in S:
                    p=p+1
                LW.append(p)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
            LW.append(0)
    LC.append('C14')

    #QUALITY CRITERIA C15
    if (joueuri in S and joueurj in S):
            if len(Mflotteurs[int(joueuri)-1])>1:
                if (joueuri in list(Liste_Flotteurs['NA']) and Mflotteurs[joueurj-1][-2]==1):
                    LW.append(-1)
                else:
                    LW.append(0)
            else:
                    LW.append(0)
    else:
            LW.append(0)

    LC.append('C15')
    
    #QUALITY CRITERIA C16
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if len(Mflotteurs[joueurj-1])>0:
            if (joueuri in S and joueurj in Sprime and Mflotteurs[joueuri-1][-1]==-1):
                k=int(sum(Mscores[joueurj-1])-sum(Mscores[joueuri-1]))
                LW.append(-k)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
            LW.append(0)
    LC.append('C16')
    #QUALITY CRITERIA C17
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if len(Mflotteurs[joueurj-1])>1:
            if (joueuri in S and joueurj in Sprime and Mflotteurs[joueurj-1][-1]==1 ):
                k=int(sum(Mscores[joueuri-1])-sum(Mscores[joueurj-1]))
                LW.append(-k)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
        LW.append(0)
    LC.append('C17')
    #QUALITY CRITERIA C18
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if len(Mflotteurs[joueurj-1])>1:
            if (joueuri in S and joueurj in Sprime and Mflotteurs[joueuri-1][-2]==-1 ):
                k=int(sum(Mscores[joueuri-1])-sum(Mscores[joueurj-1]))
                LW.append(-k)
            else:
                LW.append(0)
        else:
            LW.append(0)
    else:
        LW.append(0)
    LC.append('C18')
    #QUALITY CRITERIA C19
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if len(Mflotteurs[joueurj-1])>1:
            if len(Mflotteurs[joueurj-1])>1:
                if (joueuri in S and joueurj in Sprime and Mflotteurs[joueurj-1][-2]==1 ):
                    k=int(sum(Mscores[joueuri-1])-sum(Mscores[joueurj-1]))
                    LW.append(-k)
                else:
                    LW.append(0)
            else:
                LW.append(0)
    else:
                LW.append(0)

    LC.append('C19')
    
    
        #EXCHANGE RULE NUMBER 1

    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
    
        if joueuri in S1 and joueurj in S1:
          LW.append(-1)
        elif joueuri in S2 and joueurj in S2:
            LW.append(-1)
        else:
            LW.append(0)
    else:
            LW.append(0)
    LC.append('ER1')
    
    
    #EXCHANGE RULE NUMBER 2
    
    
    As=len(S1)+0.5
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:

        if joueuri in S1 and joueurj in S1:
            for i in range(len(S)):
                if joueuri==S[i]:
                    ri=i+1
            for i in range(len(S)):
                if joueurj==S[i]:
                    rj=i+1
            if ri<rj:
                LW.append((rj-As))
        elif joueuri in S2 and joueurj in S2:
            for i in range(len(S)):
                if joueuri==S[i]:
                    ri=i+1
            for i in range(len(S)):
                if joueurj==S[i]:
                    rj=i+1
            if ri<rj:
                LW.append((As-ri))
        else:
            LW.append(0)
    else:
        LW.append(0)
    LC.append('ER2')
    
    #EXCHANGE RULE NUMBER 3
    Lw=[0]*(len(S1))
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if joueuri in S1 and joueurj in S1:
            for i in range(len(S)):
                if joueuri==S[i]:
                    ri=i+1
            for i in range(len(S)):
                if joueurj==S[i]:
                    rj=i+1
            if ri<rj:
                Lw[floor(As-(rj))]=1
    for i in range(len(Lw)):
        LW.append(Lw[i]) 
    LC.append(['ER3']*(len(S1)))
    
    #EXCHANGE RULE NUMBER 4
    Lw=[0]*(len(S2))
    if est_homogene(Liste_Joueurs_Niveau,Liste_Niveaux,niveau,change)==True:
        if joueuri in S2 and joueurj in S2:
            for i in range(len(S)):
                if joueuri==S[i]:
                    ri=i+1
            for i in range(len(S)):
                if joueurj==S[i]:
                    rj=i+1
            if ri<rj:
                Lw[floor((ri)-As)]=1
    for i in range(len(Lw)):
        LW.append(Lw[i])  
    LC.append(['ER4']*(len(S2)))
    

    #TRANSPOSITION RULE
    Lw=[0]*(len(S)-1)
    LC.append(['TR']*(len(S)-1))
    if (joueuri in S1 and joueurj in S2):
        for i in range(len(S)):
            if joueuri==int(S[i]):
                ri=i+1
        for i in range(len(S)):
            if joueurj==int(S[i]):
                rj=i+1
        if ri<rj:
            Lw[ri-1]=-rj
    for i in range(len(Lw)):
        LW.append(Lw[i])
    
    #SUM
    w=0


    for i in range(1,len(LW)+1):
        w=w+int(M**(len(LW)-i))*int(LW[i-1])

    if joueuri==5 and joueurj==10:
        print(S)
        print(S1,S2)
        print(LC)
        print(LW)


    

    return w

