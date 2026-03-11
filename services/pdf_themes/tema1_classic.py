from reportlab.lib import colors
from reportlab.lib.units import cm

def hex_color(h):
    h=h.lstrip("#"); r,g,b=int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)
    return colors.Color(r/255,g/255,b/255)

def wrap_text(c,text,x,y,max_w,font,size,clr,line_h,min_y=1.2*cm):
    c.setFont(font,size); c.setFillColor(clr)
    words=str(text or "").split(); line=""
    for w in words:
        test=(line+" "+w).strip()
        if c.stringWidth(test,font,size)<=max_w: line=test
        else:
            if line: c.drawString(x,y,line); y-=line_h
            line=w
            if y<min_y: return y
    if line: c.drawString(x,y,line); y-=line_h
    return y

def get_skill_name(sk):
    if isinstance(sk, dict): return sk.get("name", "")
    return str(sk)

def get_skill_level(sk):
    if isinstance(sk, dict): return sk.get("level", 0)
    return 0

def draw_skill_bar(c, x, y, bar_w, level, clr_fill, clr_bg):
    if not level: return
    c.setFillColor(clr_bg); c.roundRect(x, y-0.1*cm, bar_w, 0.17*cm, 0.06*cm, fill=1, stroke=0)
    c.setFillColor(clr_fill); c.roundRect(x, y-0.1*cm, bar_w*min(level/5.0,1.0), 0.17*cm, 0.06*cm, fill=1, stroke=0)

def draw_skill_dots(c, x, y, level, clr_on, clr_off, r=0.09*cm):
    if not level: return
    for d in range(5):
        c.setFillColor(clr_on if d < level else clr_off)
        c.circle(x+d*0.3*cm, y+0.07*cm, r, fill=1, stroke=0)

PALETTES={
    "mavi":  {"p":"1A5276","s":"2E86C1","sb":"154360","lt":"AED6F1"},
    "gri":   {"p":"212121","s":"555555","sb":"111111","lt":"CCCCCC"},
    "teal":  {"p":"00695C","s":"00897B","sb":"004D40","lt":"80CBC4"},
    "bordo": {"p":"7B1A1A","s":"C0392B","sb":"5B0E0E","lt":"F1948A"},
    "yesil": {"p":"1E6B3C","s":"27AE60","sb":"145A32","lt":"A9DFBF"},
}

def render(c, cv, page_w, page_h, renk="mavi"):
    pal=PALETTES.get(renk,PALETTES["mavi"])
    P=hex_color(pal["p"]); S=hex_color(pal["s"]); SBG=hex_color(pal["sb"]); LT=hex_color(pal["lt"])
    W=colors.white; TXT=hex_color("222222"); GRY=hex_color("666666")
    SB_W=6.5*cm

    c.setFillColor(S); c.rect(0,page_h-5.5*cm,SB_W,5.5*cm,fill=1,stroke=0)
    c.setFillColor(LT); c.rect(0,page_h-5.7*cm,SB_W,0.2*cm,fill=1,stroke=0)
    c.setFillColor(SBG); c.rect(0,0,SB_W,page_h-5.7*cm,fill=1,stroke=0)
    c.setFillColor(W); c.rect(SB_W,0,page_w-SB_W,page_h,fill=1,stroke=0)
    c.setFillColor(S); c.rect(SB_W,page_h-0.35*cm,page_w-SB_W,0.35*cm,fill=1,stroke=0)

    parts=cv.get("name","").split()
    c.setFillColor(W)
    if parts: c.setFont("DJ-B",16); c.drawCentredString(SB_W/2,page_h-2.2*cm,parts[0])
    if len(parts)>1: c.setFont("DJ-B",13); c.drawCentredString(SB_W/2,page_h-3.1*cm," ".join(parts[1:]))
    c.setFont("DJ",8.5); c.setFillColor(LT); c.drawCentredString(SB_W/2,page_h-4.2*cm,cv.get("title","")[:30])

    sy=page_h-6.5*cm
    c.setFont("DJ-B",9); c.setFillColor(LT); c.drawString(0.5*cm,sy,"Kisisel bilgiler"); sy-=0.3*cm
    c.setFillColor(S); c.rect(0.5*cm,sy,SB_W-1.0*cm,0.05*cm,fill=1,stroke=0); sy-=0.45*cm
    for item in (cv.get("contact") or [])[:5]:
        c.setFont("DJ",7.5); c.setFillColor(W); c.drawString(0.5*cm,sy,str(item)[:32]); sy-=0.45*cm

    sy-=0.3*cm
    c.setFont("DJ-B",9); c.setFillColor(LT); c.drawString(0.5*cm,sy,"Beceriler"); sy-=0.3*cm
    c.setFillColor(S); c.rect(0.5*cm,sy,SB_W-1.0*cm,0.05*cm,fill=1,stroke=0); sy-=0.45*cm
    bar_w=SB_W-1.0*cm
    for sk in (cv.get("skills") or [])[:8]:
        if sy<5.0*cm: break
        c.setFont("DJ",7.5); c.setFillColor(W); c.drawString(0.5*cm,sy,get_skill_name(sk)[:26]); sy-=0.28*cm
        draw_skill_bar(c,0.5*cm,sy,bar_w,get_skill_level(sk),LT,hex_color("2C3E6B"))
        sy-=0.4*cm

    if cv.get("languages") and sy>2.5*cm:
        sy-=0.2*cm
        c.setFont("DJ-B",9); c.setFillColor(LT); c.drawString(0.5*cm,sy,"Diller"); sy-=0.3*cm
        c.setFillColor(S); c.rect(0.5*cm,sy,SB_W-1.0*cm,0.05*cm,fill=1,stroke=0); sy-=0.45*cm
        for lang in (cv.get("languages") or [])[:4]:
            if sy<1.0*cm: break
            c.setFont("DJ",8); c.setFillColor(W); c.drawString(0.5*cm,sy,get_skill_name(lang)[:20])
            draw_skill_dots(c,3.5*cm,sy,get_skill_level(lang),LT,hex_color("2C3E6B"))
            sy-=0.42*cm

    rx=SB_W+0.65*cm; rw=page_w-SB_W-1.1*cm

    def sec(title,y):
        c.setFont("DJ-B",11); c.setFillColor(P); c.drawString(rx,y,title); y-=0.25*cm
        c.setFillColor(LT); c.rect(rx,y,rw,0.05*cm,fill=1,stroke=0)
        return y-0.42*cm

    my=page_h-1.1*cm
    my=sec("Profil",my)
    if cv.get("summary"): my=wrap_text(c,cv["summary"],rx,my,rw,"DJ",8.5,GRY,0.38*cm)
    my-=0.5*cm
    my=sec("Egitimler",my)
    for edu in (cv.get("education") or [])[:3]:
        if my<18.0*cm: break
        c.setFont("DJ-B",9); c.setFillColor(TXT); c.drawString(rx,my,str(edu.get("degree",""))[:40])
        if edu.get("date"): c.setFont("DJ",8); c.setFillColor(GRY); c.drawRightString(page_w-0.5*cm,my,str(edu["date"]))
        my-=0.38*cm
        if edu.get("school"): c.setFont("DJ",8); c.setFillColor(S); c.drawString(rx,my,str(edu["school"])[:40]); my-=0.45*cm
    my-=0.3*cm
    my=sec("Is Deneyimi",my)
    for exp in (cv.get("experience") or [])[:3]:
        if my<8.0*cm: break
        c.setFont("DJ-B",9.5); c.setFillColor(TXT); c.drawString(rx,my,str(exp.get("title",""))[:40])
        if exp.get("date"): c.setFont("DJ",8); c.setFillColor(GRY); c.drawRightString(page_w-0.5*cm,my,str(exp["date"]))
        my-=0.38*cm
        if exp.get("company"): c.setFont("DJ",8); c.setFillColor(S); c.drawString(rx,my,str(exp["company"])[:40]); my-=0.4*cm
        for b in (exp.get("bullets") or [])[:4]:
            if my<7.5*cm: break
            my=wrap_text(c,"• "+b,rx+0.2*cm,my,rw-0.2*cm,"DJ",8,GRY,0.36*cm)
        my-=0.3*cm
    if cv.get("courses") and my>4.0*cm:
        my=sec("Kurslar",my)
        for cr in (cv.get("courses") or [])[:2]:
            if my<2.5*cm: break
            c.setFont("DJ-B",9); c.setFillColor(TXT); c.drawString(rx,my,str(cr.get("name",""))[:45]); my-=0.38*cm
            prov=str(cr.get("provider",""))
            if cr.get("date"): prov+=" – "+str(cr["date"])
            c.setFont("DJ",8); c.setFillColor(GRY); c.drawString(rx,my,prov[:50]); my-=0.35*cm
            if cr.get("description"): my=wrap_text(c,cr["description"],rx,my,rw,"DJ",8,GRY,0.35*cm)
            my-=0.2*cm
    if my>2.0*cm:
        my=sec("Referanslar",my)
        c.setFillColor(S); c.rect(rx,my+0.05*cm,0.25*cm,0.25*cm,fill=1,stroke=0)
        c.setFont("DJ",8.5); c.setFillColor(GRY); c.drawString(rx+0.38*cm,my+0.02*cm,"Talep durumunda referans sunulabilir.")