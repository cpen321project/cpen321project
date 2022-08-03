package com.example.findyourpeers;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ChatBoxAdapter extends RecyclerView.Adapter<ChatBoxAdapter.MyViewHolder> {
    private List<Message> MessageList;

    public ChatBoxAdapter(List<Message> MessagesList) {
        this.MessageList = MessagesList;
    }

    @Override
    public int getItemCount() {
        return MessageList.size();
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, final int position) {
        Message m = MessageList.get(position);
        holder.nickname.setText(m.getNickname() + ": ");
        holder.message.setText(m.getMessage());
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView nickname;
        public TextView message;

        public MyViewHolder(View view) {
            super(view);

            nickname = (TextView) view.findViewById(R.id.editTextTextPersonName);
            message = (TextView) view.findViewById(R.id.message);
        }
    }

}