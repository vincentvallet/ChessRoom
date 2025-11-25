from Appariement import *
import tkinter as tk
from tkinter import ttk

import re

window=tk.Tk()
window.state('zoomed') 
window.title('FastPapi')

import os
import sys


def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS  
    except Exception:
        base_path = os.path.abspath(".")  
    return os.path.join(base_path, relative_path)



# Utiliser la fonction pour charger l’icône
window.iconbitmap(resource_path("favicon.ico"))



import tkinter.font as tkfont

font_italique = tkfont.Font(family="Helvetica", size=10, slant="italic")

table = None
myEntry=None

label=None
btnretour=None

label1=None



def getEntry():
    global btnretour
    global myEntry
    global Gurl
    global Gurlmain
    global Nrondemax
    Gurlmain=myEntry.get()
    id=re.findall('\\d+', Gurlmain)[0]
    Gurl='https://www.echecs.asso.fr/Resultats.aspx?URL=Tournois/Id/'+str(id)+'/'+str(id)+'&Action=Ga'
    Nrondemax=getNmax(Gurlmain)
    Grondes,tournoi=getNrondes(Gurl)
    r=range(1,min(Grondes,Nrondemax-1)+2)
    choices = [str(x) for x in r]
    variable = tk.StringVar(window)
    variable.set('1')
    global label
    label = tk.Label(window, text='Tournoi sélectionné: '+tournoi)
    label.pack()
    global label2
    label2 = tk.Label(window, text='Nombre de rondes : '+str(Nrondemax))
    label2.pack()
    global btn
    btn.destroy()
    global label1
    myEntry.destroy()
    label1.destroy()
    global label3

    label3.destroy()

    global w
    w = ttk.Combobox(window, values = choices)
    w.pack()
    global btn2
    btn2.pack()

    btnretour=tk.Button(window, height=1, width=10, text="Retour", command=Exit)
    btnretour.pack()


def Exit():
    global btnretour
    if btnretour is not None:
        btnretour.destroy()
    btnretour.destroy()
    global label
    if label is not None:
        label.destroy()

    global label2
    if label2 is not None:
        label2.destroy()

    global btn2
    if btn2 is not None:
        btn2.destroy()
        btn2 = tk.Button(window, height=1, width=40, text="Générer l'appariement", command=getEntry2)

    global w
    if w is not None:
        w.destroy()

    global table
    if table is not None:
        table.destroy()

    global label1
    label1 = tk.Label(window, text="Copier l'adresse du tournoi")
    label1.pack()
    global label3
    label3 = tk.Label(window, text='De la forme : https://www.echecs.asso.fr/FicheTournoi.aspx?Ref=12345',font=font_italique)
    label3.pack()
    global myEntry
    myEntry = tk.Entry(window, width=40)
    myEntry.pack(pady=20)
    global btn
    btn = tk.Button(window, height=1, width=10, text="Lire URL", command=getEntry)
    btn.pack()


def getEntry2():
    global GNronde
    global Nrondemax
    global w
    GNronde = int(w.get())
    global table
    if table is not None:
        table.destroy()
    X=getPairing(Gurl,GNronde,Nrondemax)

    table=ttk.Treeview(window,columns=('Table','PointsB','Blancs','EloB','Noirs','EloN','PointsN'),show='headings',height=len(X))
    table.heading('Table',text='Table')
    table.heading('PointsB',text='Pts')
    table.heading('Blancs',text='Blancs')
    table.heading('EloB',text='Elo')
    table.heading('Noirs',text='Noirs')
    table.heading('EloN',text='Elo')
    table.heading('PointsN',text='Pts')

    for i in range(len(X)):
        data=(str(i+1),X['PointsB'][i],X['Blancs'][i],X['EloB'][i],X['Noirs'][i],X['EloN'][i],X['PointsN'][i])
        table.insert(parent='',index=tk.END,values=data)
    table.pack()




label1 = tk.Label(window, text="Copier l'adresse du tournoi")
label1.pack()
label3 = tk.Label(window, text='De la forme : https://www.echecs.asso.fr/FicheTournoi.aspx?Ref=12345',font=font_italique)

label3.pack()


myEntry = tk.Entry(window, width=40)
myEntry.pack(pady=20)


btn = tk.Button(window, height=1, width=10, text="Lire URL", command=getEntry)
btn2 = tk.Button(window, height=1, width=40, text="Générer l'appariement", command=getEntry2)
btn.pack()

window.mainloop()