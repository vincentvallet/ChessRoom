
from bs4 import BeautifulSoup
from requests import get

from numpy import zeros
from numpy import sum

from re import findall

from pandas import DataFrame
from pandas import options
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
options.mode.chained_assignment = None  # default='warn'

def getTable(url):
    page=get(url)
    soup=BeautifulSoup(page.text,features="html.parser")

    table = soup.find_all('table')[1]

    Title_line = table.find('tr', class_='papi_small_t')
    Titles = Title_line.find_all('td')
    Title_List = [title.text for title in Titles]
    Title_List[1]='Titre'

    df = DataFrame(columns=Title_List)

    column_data=table.find_all(lambda tag: tag.name == "tr" and not tag.find_parent(class_="papi_l"))

    for row in column_data[2:]:
        row_data=row.find_all(lambda tag: tag.name == "td" and tag.get("class") and any(c in ["papi_r", "papi_c"] for c in tag["class"])  and not tag.find_parent(class_="papi_l"))
        individual_row_data=[data.text for data in row_data]
        name=row.find_all('b')[0].text
        individual_row_data.insert(2,name)
        length=len(df)
        df.loc[length]=individual_row_data
    return df

def getNrondes(url):
    
    page=get(url)
    soup=BeautifulSoup(page.text,features="html.parser")

    tournoi = ((soup.find('tr', class_='papi_titre').find('td')).contents[0]).strip()


    table = soup.find_all('table')[1]

    Title_line = table.find('tr', class_='papi_small_t')
    Titles = Title_line.find_all('td')
    Title_List = [title.text for title in Titles]
    Title_List[1]='Titre'

    df = DataFrame(columns=Title_List)
    df=df.filter(like='R ')


    return len(df.columns),tournoi

def getNmax(url):
    page=get(url)
    soup=BeautifulSoup(page.text,features="html.parser")
    Nrondemax = soup.find('tr', id="ctl00_ContentPlaceHolderMain_RowNbrRondes").find_all('td')[1].find('span').contents[0]
    return int(Nrondemax)




def getNumber(Table):
    df = Table[['Nom','Pl','Elo','Titre']]
    Liste_titre=['g','m','gf','f','mf','c','ff','cf','\xa0']
    for i in range(len(df)):
        df['Pl'][i]=int(df['Pl'][i])
        df['Elo'][i]=int(df['Elo'][i][0:4])
        df['Titre'][i]=Liste_titre.index(str(Table['Titre'][i]))
    df_sorted=df.sort_values(by=['Elo','Titre','Nom'],ascending=[False,True,True],ignore_index=[True,True,True])
    df_sorted.insert(loc=3, column='NA', value=range(1,len(Table)+1))
    res=df_sorted[['Pl','NA']]
    return res

def getScores(Liste_Numeros,df):
    Liste_Joueurs=Liste_Numeros.sort_values(by='Pl',ascending=True,ignore_index=True)
    Nrondes=len(df.columns)
    X=zeros([len(Liste_Joueurs),Nrondes])
    for i in range(len(Liste_Joueurs)):
        for j in range(Nrondes):
            k=Liste_Joueurs['NA'][i]-1
            R=df.iloc[i,j]
            if len(R)>0:
                if R[0]=='+':
                    X[k,j]=1
                elif R[0]=='-':
                    X[k,j]=0
                elif R[0]=='=':
                    X[k,j]=0.5
                elif R[0]=='E':
                    X[k,j]=1   
                elif R[0]=='>':
                    X[k,j]=1 

    return X


def getRencontres(Liste_Numeros, df):
    Nrondes=len(df.columns)
    Liste_Joueurs=Liste_Numeros.sort_values(by='Pl',ascending=True,ignore_index=True)
    Mrencontres=zeros([len(Liste_Joueurs),len(Liste_Joueurs)])
    
    for i in range(0,len(Liste_Joueurs)):
        for j in range(0,Nrondes):
            R=df.iloc[i,j]
            if len(findall('\\d+', R))>0:
                k=Liste_Joueurs['NA'][i]-1
                l=Liste_Joueurs['NA'][int(findall('\\d+', R)[0])-1]-1
                Mrencontres[k,l]=1
                Mrencontres[l,k]=1
            elif len(R)>0 and R[0]=='E':
                k=Liste_Joueurs['NA'][i]-1
                Mrencontres[k,k]=1
            elif len(R)>0 and R[0]=='>':
                k=Liste_Joueurs['NA'][i]-1
                Mrencontres[k,k]=1
    return Mrencontres


def getCouleurs(Liste_Numeros, df):
    Liste_Joueurs=Liste_Numeros.sort_values(by='Pl',ascending=True,ignore_index=True)
    Nrondes=len(df.columns)
    Mcouleurs=zeros([len(Liste_Joueurs),Nrondes])
    for i in range(len(Liste_Joueurs)):
        for j in range(Nrondes):
            k=Liste_Joueurs['NA'][i]-1
            R=df.iloc[i,j]
            if len(R)>0:
                if R[-1]=='B':
                    Mcouleurs[k,j]=1
                elif R[-1]=='N':
                    Mcouleurs[k,j]=-1               
    return Mcouleurs


def getFlotteurs(Liste_Numeros,df,Mscores):
    Liste_Joueurs=Liste_Numeros.sort_values(by='Pl',ascending=True,ignore_index=True)
    Nrondes=len(df.columns)

    Tableaurencontres=zeros([len(Liste_Joueurs),Nrondes])
    Mflotteurs=zeros([len(Liste_Joueurs),Nrondes])

    for i in range(0,len(Liste_Joueurs)):
        for j in range(0,Nrondes):
            R=df.iloc[i,j]
            if len(findall('\\d+', R))>0:
                Tableaurencontres[i,j]=findall('\\d+', R)[0] 
    for i in range(0,len(Liste_Joueurs)):
        for j in range(0,Nrondes):
            k=Liste_Joueurs['NA'][i]
            if Tableaurencontres[i,j]>0:
                l=Liste_Joueurs['NA'][Tableaurencontres[i,j]-1]
                Pointsk=sum(Mscores[k-1][0:j])
                Pointsl=sum(Mscores[l-1][0:j])
                if Pointsk<Pointsl:
                    Mflotteurs[k-1,j]=+1
                    Mflotteurs[l-1,j]=-1
                elif Pointsk>Pointsl:
                    Mflotteurs[k-1,j]=-1
                    Mflotteurs[l-1,j]=1
    return Mflotteurs


def getPlayerName(Liste_Numeros,Tableau):
    ListeNoms=[]
    for i in range(len(Liste_Numeros)):
        ListeNoms.append(Tableau['Nom'][Liste_Numeros['Pl'][i]-1])
    return ListeNoms

def getPlayerElo(Liste_Numeros,Tableau):
    ListeElo=[]
    for i in range(len(Liste_Numeros)):
        ListeElo.append(Tableau['Elo'][Liste_Numeros['Pl'][i]-1])
    return ListeElo

def getPlayerScore(Liste_Finale):
    Liste_Joueurs=Liste_Finale.sort_values(by='NA',ascending=True,ignore_index=True)
    ListeScore=[]
    for i in range(len(Liste_Joueurs)):
        ListeScore.append(Liste_Joueurs['Points'][i])
    return ListeScore
    


def getData(Table,Ronde):
    Ronde=Ronde-1
    Liste_Numeros=getNumber(Table)
    df=(Table.filter(like='R ')).iloc[:,0:Ronde]
    MScores=getScores(Liste_Numeros,df)
    MCouleurs=getCouleurs(Liste_Numeros, df)
    Mrencontres=getRencontres(Liste_Numeros, df)
    Mflotteurs=getFlotteurs(Liste_Numeros,df,MScores)
    return MScores,MCouleurs,Mrencontres,Mflotteurs

def getListeFinale(Liste_Numeros,Tableau_Scores):
    X=DataFrame(columns=['NA','Points'])
    X['NA']=Liste_Numeros['NA']
    for i in range(0,len(Liste_Numeros)):
        X['Points'][i]=sum(Tableau_Scores[i][:])
    X=X.sort_values(by = ['Points', 'NA'], ascending = [False, True],ignore_index=True)
    return X

def getListeJoueursRonde(Liste_Finale,Mrencontres):
    Exempt=0
    N=len(Liste_Finale)
    ListeJoueursRonde=Liste_Finale
    if N%2!=0:
        for i in range(0,len(Liste_Finale)):
            if Mrencontres[int(ListeJoueursRonde['NA'][ListeJoueursRonde.index[len(Liste_Finale)-1-i]])-1,int(ListeJoueursRonde['NA'][ListeJoueursRonde.index[len(Liste_Finale)-1-i]])-1]==0:
                Exempt=int(ListeJoueursRonde['NA'][ListeJoueursRonde.index[len(Liste_Finale)-1-i]])
                ListeJoueursRonde=ListeJoueursRonde.drop(ListeJoueursRonde.index[len(Liste_Finale)-1-i])
                ListeJoueursRonde=ListeJoueursRonde.reset_index()
                return ListeJoueursRonde,Exempt
    else:
        return ListeJoueursRonde,Exempt

def getNiveaux(Liste_Finale):
    Liste_Points=[]
    Liste_Indices=[]
    for i in range(len(Liste_Finale)):
        if Liste_Finale['Points'][i] not in Liste_Points:
            Liste_Points.append(Liste_Finale['Points'][i])
            Liste_Indices.append(i)  
    return Liste_Points, Liste_Indices

